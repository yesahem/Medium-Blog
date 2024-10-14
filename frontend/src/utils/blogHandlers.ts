import axios from "axios";
import { BLOG_API_ENDPOINT_PROD } from "./env";
import { toast } from "react-custom-alert";

// DELETE HANDLER
export const deleteHandler = async (
  id: string,
  token: string,
  navigate: any
) => {
  try {
    const res = await axios.delete(
      `${BLOG_API_ENDPOINT_PROD}/deletepost/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (
      res?.data?.message === "Not Allowed on Guest Account!" &&
      res?.status === 403
    ) {
      window.alert("Create New Account!");
      return;
    }

    toast.success("Deleted successfully");
    navigate("/blog");
  } catch (error) {
    console.error("Error deleting post:", error);
    toast.error("Failed to delete the post. Please try again.");
  }
};

interface SubmitHandlerParams {
  id: string;
  token: string;
  titleValue: string;
  contentValue: string;
  setIsOpen: (isOpen: boolean) => void;
}

// SUBMIT HANDLER
export const submitHandler = async ({
  id,
  token,
  titleValue,
  contentValue,
  setIsOpen,
}: SubmitHandlerParams) => {
  try {
    const res = await axios.put(
      `${BLOG_API_ENDPOINT_PROD}/updatepost`,
      {
        id: id,
        title: titleValue,
        content: contentValue,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (
      res?.data?.message === "Not Allowed on Guest Account!" &&
      res?.status === 403
    ) {
      window.alert("Create New Account!");
      return;
    }

    toast.success("Updated successfully");
    setIsOpen(false);
  } catch (error) {
    console.error("Error updating post:", error);
    toast.error("Failed to update the post. Please try again.");
  }
};
