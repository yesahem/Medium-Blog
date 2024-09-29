import { SyntheticEvent, useState } from "react";
// import { Link } from "react-router-dom";

export default function UploadBlogs() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  function blogUploadHandler(e: SyntheticEvent) {
    // send the Title content to the backend and store in Db 
    e.preventDefault()
    console.log("I am a blog upload handler ")
    console.log(`Title : ${title}`);
    console.log(`Content : ${content}`);


  }
  return (


    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex justify-center items-center">
        <div className="w-full py-12 md:py-24 lg:py-32">
          <div className=" mx-auto px-4 md:px-6">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-center tracking-tight sm:text-5xl xl:text-6xl">
                  Upload your Blog
                </h1>
                <div className="items-center justify-center flex">
                  <p className="max-w-lg text-gray-500 md:text-xl justify-center">
                    Blogging is an art, Be an artist
                  </p>
                </div>
              </div>
              <div className="w-full max-w-md p-6 bg-white shadow rounded-lg mx-auto border -2 border-green-400 ">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <div className="block text-sm font-medium">
                      Title
                    </div>
                    <input
                      autoFocus
                      placeholder="Title"
                      required
                      onChange={(e) => setTitle(e.target.value)} // try to implement debouncing here to wait for some time and then change the title and content  
                      className="block w-full p-2 border rounded"
                    />
                  </div>
                  <div className="space-y-2">
                    <div

                      className="block text-sm font-medium"
                    >
                      Your Content Here
                    </div>
                    <textarea
                      placeholder="Content"
                      required
                      onChange={(e) => setContent(e.target.value)}
                      className="block w-full p-2 border rounded min-h-48"
                    />
                  </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      onClick={blogUploadHandler}
                      className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Upload
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>







  )
}
