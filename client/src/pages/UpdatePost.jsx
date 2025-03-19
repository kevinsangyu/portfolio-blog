import { Button, FileInput, Select, TextInput, Alert } from "flowbite-react";
import React, { useState, useRef, useMemo, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UpdatePost() {
  // it cant be an issue with loading in images... the live service version can load in images just fine...
  // the data is fetched correctly...
  // try removing certain parts to see if it changes things, starting from the drag-drop and copy-paste functionalities...
  const navigate = useNavigate();
  const quillRef = useRef()
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [formdata, setFormdata] = useState({ title: "", category: "general", content: "", image: "" });
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [inTextImageProgress, setInTextImageProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const { postId } = useParams();
  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        } else {
          setPublishError(null);
          setFormdata(data.posts[0]);
        }
      };
      fetchPost();
    } catch (error) {
      console.log(error);
    }
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/post/updatepost/${postId}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formdata),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        // don't need this here, because to get to this page, token is verified anyway.
        // if (res.status === 420) { // user info present in redux, but cookies have expired.
        //   console.log("Dispatching signout...");
        //   dispatch(signOutSuccess());
        //   dispatch(signInFailure("You have been logged out. Please log back in."))
        // }
        setPublishError(data.message);
        return;
      } else {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError(`Could not update: ${error.message}`);
    }
  };
  const uploadImage = async (file, face) => {
    // handles uploading images to firebase
    // face is a boolean switch that refers to if the uploaded image is of the face image of the blog/post
    if (!file) {
      return
    } else {
      return new Promise((resolve, reject) => {
        // returns a promise to ensure that it will wait for the image to finish uploading
        const storage = getStorage(app);
        const fileName = new Date().getTime() + "-" + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (face) {
              setImageUploadProgress(progress.toFixed(0));
            } else {
              setInTextImageProgress(progress.toFixed(0))
            }
          },
          (error) => {
            setImageUploadError(`Could not upload image: ${error}`);
            if (face) {
              setImageUploadProgress(null);
            } else {
              setInTextImageProgress(null)
            }
            reject(error)
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
              if (face) {
                setImageUploadProgress(null);
              } else {
                setInTextImageProgress(null)
              }
              setImageUploadError(null)
              resolve(downloadURL)
            } catch (error) {
              reject(error)
            }
          }
        );
      })
    }
  }
  const insertImage = (url) => {
    // if the image is added to the reactquill textbox, insert the image into the reactquill textbox at the cursor
    const quilleditor = quillRef?.current?.getEditor()
    if (quilleditor) {
      const range = quilleditor.getSelection()
      quilleditor.insertEmbed(range.index, "image", url)
    }
  }
  const handleUploadImage = async () => {
    try {
      setImageUploadError(null);
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      const url = await uploadImage(file, true)
      setFormdata({...formdata, image: url})
    } catch (error) {
      console.log(error);
      setImageUploadError(`Could not upload image: ${error}`);
      setImageUploadProgress(null);
    }
  };
  const quillImageButton = async () => {
    // handles the image upload for the button on the reactquill's ribbon
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) {
        return;
      }
      const url = await uploadImage(file, false)
      insertImage(url)
    };
  };
  useEffect(() => {
    // alters the image paste and drag/drop method of inserting images
    const quilleditor = quillRef?.current?.getEditor()
    if (!quilleditor) {
      console.log("Unable to get quill reference")
      return
    }

    quilleditor.root.addEventListener("drop", async (event) => {
      event.preventDefault()
      if (!event.dataTransfer.files.length) {
        return
      } else {
        const file = event.dataTransfer.files[0]
        const url = await uploadImage(file, false)
        insertImage(url)
      }
    })

    quilleditor.root.addEventListener("paste", async (e) => {
      const clipboardItems = e.clipboardData.items
      for (const item of clipboardItems) {
        if (item.type.startsWith("image")) {
          e.preventDefault()
          const file = item.getAsFile()
          const url = await uploadImage(file)
          insertImage(url)
        }
      }
    })
  }, [])
  const quillmodules = useMemo(() => (
    // useMemo() is used so react doesn't re-render the component, which makes it disappear.
  {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, false] }],
        ["bold", "italic", "underline", "strike", "link"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["image"],
      ],
      handlers: {
        image: quillImageButton,
      },
    },
    clipboard: {
      matchVisual: false
    }
  }), []);
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) => {
              setFormdata({ ...formdata, title: e.target.value });
            }}
            value={formdata.title}
          />
          <Select
            onChange={(e) => {
              setFormdata({ ...formdata, category: e.target.value });
            }}
            value={formdata.category}
          >
            <option value="general">General</option>
            <option value="programming">Programming</option>
            <option value="career">Career</option>
            <option value="hobbies">Hobbies</option>
            <option value="diary">Diary</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept=";image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload image"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formdata.image && (
          <img
            src={formdata.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
        ref={quillRef}
          theme="snow"
          placeholder="Write something..."
          style={{height: 800}}
          className="h-120 mb-12"
          required
          value={formdata.content || ""}
          onChange={(value) => {
            setFormdata({ ...formdata, content: value });
          }}
          modules={quillmodules}
        />
        {inTextImageProgress && (
          <div className="min-w-full flex flex-col">
            <span>Uploading image...</span>
            <progress value={inTextImageProgress} max={100} className="min-w-full"/>
          </div>
        )}
        <Button type="submit" gradientDuoTone="purpleToPink">
          Update
        </Button>
        {publishError && <Alert color="failure">{publishError}</Alert>}
      </form>
    </div>
  );
}
