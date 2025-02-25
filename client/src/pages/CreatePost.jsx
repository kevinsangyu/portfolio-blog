import { Button, FileInput, Select, TextInput, Alert } from "flowbite-react";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
    const navigate = useNavigate()
  const [file, setFile] = useState(null);
  const [formdata, setFormdata] = useState({category: "general"});
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [publishError, setPublishError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {  
        const res = await fetch('/api/post/create', {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(formdata)
        })
        const data = await res.json()
        if (!res.ok) {
            setPublishError(data.message)
            return
        } else {
            setPublishError(null)
            navigate(`/post/${data.slug}`)
        }
    } catch (error) {
        setPublishError(`Could not publish: ${error.message}`)
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
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e)=>{setFormdata({...formdata, title: e.target.value})}}
          />
          <Select onChange={(e)=>{setFormdata({...formdata, category: e.target.value})}}>
            {/* these categories are also in Search.jsx, if I wanted to hard code and change them. */}
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
        {imageUploadError && (<Alert color='failure'>{imageUploadError}</Alert>)}
        {formdata.image && (<img src={formdata.image} alt='upload' className="w-full h-72 object-cover"/>)}
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          onChange={(value)=>{setFormdata({...formdata, content: value})}}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToPink"
        >
          Publish
        </Button>
        {publishError && (<Alert color="failure">{publishError}</Alert>)}
      </form>
    </div>
  );
}
