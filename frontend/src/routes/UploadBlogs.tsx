import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import DarkModeToggle from "../components/DarkModeToggle";
import { BLOG_API_ENDPOINT_LOCAL } from "../utils/env";
import { useNavigate } from "react-router-dom";
import { BlogFormData, blogSchema } from "../utils";
import { toast } from "react-custom-alert";
import { ChangeEvent, useState, useEffect } from "react";
import { RxCross1 } from "react-icons/rx"; // Importing the RxCross1 icon

export default function UploadBlogs() {
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]); // State to hold image files

  const { register, handleSubmit, formState: { errors } } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
  });

  const token = localStorage.getItem("jwt-token");

  // Mutation for blog upload
  const uploadBlogMutation = useMutation({
    mutationFn: (data: FormData) => // Change data to FormData
      axios.post(
        `${BLOG_API_ENDPOINT_LOCAL}/createpost`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      ),
    onSuccess: (res) => {
      console.log("Response after blog upload:", res);
      toast.success("Blog uploaded successfully");
      navigate("/blog");
    },
    onError: (error) => {
      console.error("Error uploading blog:", error);
      toast.error("An error occurred during blog upload");
    },
  });
  const onInvalid = (errors) => console.error(errors)
  // Handle form submission
  const onSubmit = (data: BlogFormData) => {
    console.log("reacted")
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("published", "true");
    images.forEach((image, index) => {
      formData.append(`picture_${index}`, image); // Append each image to FormData
    });
    uploadBlogMutation.mutate(formData); // Pass FormData instead of plain data
  };

  // Handle image selection
  const handleImages = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(event.target.files || []); // Ensure files is never null
    setImages((prev) => [...prev, ...files]); // Add selected images to state
  };

  // Handle image removal
  const handleRemoveImage = (name: string): void => {
    setImages((prev) => prev.filter((img) => img.name !== name)); // Remove the image with the given name
  };

  // For debugging purposes, log images state when it changes
  useEffect(() => {
    console.log(images, "Selected images");
    console.log(errors);
  }, [images]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800">
        <div className="flex items-center">
          <DarkModeToggle />
        </div>
      </header>
      <div className="flex-1 flex justify-center items-center">
        <div className="w-full py-12 md:py-24 lg:py-32">
          <div className="mx-auto px-4 md:px-6">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-center tracking-tight sm:text-5xl xl:text-6xl text-gray-900 dark:text-gray-100">
                  Upload your Blog
                </h1>
                <div className="items-center justify-center flex">
                  <p className="max-w-lg text-gray-500 md:text-xl justify-center dark:text-gray-300">
                    Blogging is an art, Be an artist
                  </p>
                </div>
              </div>
              <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 shadow rounded-lg mx-auto border-2 border-green-400">
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit,onInvalid)}>
                  <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                      Title
                    </label>
                    <input
                      id="title"
                      {...register("title")}
                      placeholder="Title"
                      className="block w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="content" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                      Your Content Here
                    </label>
                    <textarea
                      id="content"
                      {...register("content")}
                      placeholder="Content"
                      className="block w-full p-2 border rounded min-h-48 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                    {errors.content && <span className="text-red-500 text-sm">{errors.content.message}</span>}
                  </div>

                  {/* Image Upload */}
                  <input
                    type="file"
                    className="block w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    multiple
                    // {...register("pictures")}
                    name="blog-image"
                    onChange={handleImages}
                    accept=".jpeg,.png"
                  />

                  {/* Display Selected Images */}
                  <div className="block w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    {images.length > 0 && images.map((img, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <img src={URL.createObjectURL(img)} height="100rem" width="100rem" alt={img.name} />
                        <span>{img.name}</span>
                        <RxCross1
                          className="inline mx-2 cursor-pointer"
                          onClick={() => handleRemoveImage(img.name)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Submit Button */}
                  <div className="mt-4">
                    <button
                      type="submit"
                      disabled={uploadBlogMutation.isPending}
                      className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                      
                    >
                      {uploadBlogMutation.isPending ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
