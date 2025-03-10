import { Button, FileInput, Select, TextInput, Alert } from "flowbite-react";
import React, { useEffect, useState } from "react";
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
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [formdata, setFormdata] = useState({ category: "general" });
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
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
  const handleUploadImage = async () => {
    try {
      setImageUploadError(null);
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError(`Could not upload image: ${error}`);
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormdata({ ...formdata, image: downloadURL });
          });
        }
      );
    } catch (error) {
      console.log(error);
      setImageUploadError(`Could not upload image: ${error}`);
      setImageUploadProgress(null);
    }
  };
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
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormdata({ ...formdata, content: value });
          }}
          value={formdata.content}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Update
        </Button>
        {publishError && <Alert color="failure">{publishError}</Alert>}
      </form>
    </div>
  );
}
