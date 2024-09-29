import axios from "axios"
import { useParams } from "react-router-dom"
export default function Fetch() {

  const { id } = useParams();
  console.log(id)
  let blogData ;
  axios.get(`${id}`).then((data) => {
    blogData = data
  })
  return (
    <div>
      `${blogData}`
    </div>
  )
}
