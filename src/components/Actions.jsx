import { useState } from "react";
import { AiFillEye, AiFillFileImage, AiFillFolderOpen } from "react-icons/ai";
import { TbDiscountCheckFilled } from "react-icons/tb";
import { CgDetailsMore, CgUnblock } from "react-icons/cg";
import { MdBlock, MdDelete, MdModeEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { BsBoxArrowInUpRight, BsFillImageFill } from "react-icons/bs";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { GiVerticalBanner } from "react-icons/gi";

const Actions = ({
  id,
  data,
  actionCols,
  setData,
  setPaginatedData,
  setEditModal,
  setMediaModal,
  setViewModal,
  setIsViewerOpen,
  setMarkPaidModal,
  blockUrl,
  deleteUrl,
}) => {
  const navigate = useNavigate();
  const [blockUser, setBlockUser] = useState(
    data?.status?.toLowerCase() === "inactive"
  );

  const remove = async () => {
    try {
      const isFunction = typeof deleteUrl === "function";
      const requestOptions = {
        headers: {
          accept: "application/json",
        },
        method: "POST",
        redirect: "follow",
      };
      const res = await fetch(
        ...(isFunction
          ? deleteUrl(data)
          : [`${deleteUrl}/${id}`, requestOptions])
      );

      if (res.status === 200) {
        setData((prev) => prev.filter((e) => (e.id ?? e._id) !== id));
        setPaginatedData((prev) => ({
          ...prev,
          items: prev.items.filter((e) => (e.id ?? e._id) !== id),
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBlock = async () => {
    try {
      const isFunction = typeof blockUrl === "function";
      const requestOptions = {
        headers: {
          accept: "application/json",
        },
        method: "POST",
        redirect: "follow",
      };
      const res = await fetch(
        ...(isFunction ? blockUrl(data) : [`${blockUrl}/${id}`, requestOptions])
      );
      console.log("res status =======>", res.status);

      if (res.status === 200) {
        setBlockUser(!blockUser);
        setData((prev) =>
          prev.map((item) =>
            item.id == id
              ? {
                  ...item,
                  status:
                    item.status.toLowerCase() === "active"
                      ? "INACTIVE"
                      : "ACTIVE",
                }
              : item
          )
        );
        setPaginatedData((prev) => ({
          ...prev,
          items: prev.items.map((item) =>
            item.id == id
              ? {
                  ...item,
                  status:
                    item.status.toLowerCase() === "active"
                      ? "INACTIVE"
                      : "ACTIVE",
                }
              : item
          ),
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const checkAction = (name) => {
    let element;

    if (name === "View") {
      element = (
        <td className="self-center px-6 py-2 pt-4 text-lg text-center">
          <button
            onClick={() => setViewModal({ isOpen: true, data })}
            className="font-medium text-gray-600 hover:text-gray-800"
          >
            <AiFillEye />
          </button>
        </td>
      );
    } else if (name === "Images") {
      element = (
        <td className="self-center px-6 py-2 pt-4 text-lg text-center">
          <button
            onClick={() =>
              setIsViewerOpen({ isVisible: true, images: data._images })
            }
            className="font-medium text-gray-600 hover:text-gray-800"
          >
            <AiFillFileImage />
          </button>
        </td>
      );
    } else if (name === "Banners") {
      element = (
        <td className="self-center px-6 py-2 pt-4 text-xl text-center">
          <button
            onClick={() => navigate("/category/" + data?.id)}
            className="font-medium text-gray-600 hover:text-gray-800"
          >
            <BsFillImageFill />
          </button>
        </td>
      );
    } else if (name === "Assign") {
      element = (
        <td className="self-center px-6 py-2 pt-4 text-xl text-center">
          <button
            onClick={() => navigate("/assign-category/" + data?.id)}
            className="font-medium text-gray-600 hover:text-gray-800"
          >
            <BiSolidCategoryAlt />
          </button>
        </td>
      );
    } else if (name === "Media") {
      element = (
        <td className="self-center px-6 py-2 pt-4 text-lg text-center">
          <button
            onClick={() =>
              setMediaModal({
                isVisible: true,
                media: data._media || data._media_files,
              })
            }
            className="font-medium text-gray-600 hover:text-gray-800"
          >
            <AiFillFolderOpen />
          </button>
        </td>
      );
    } else if (name === "Edit") {
      element = (
        <td className="self-center px-6 py-2 pt-4 text-lg text-center">
          <button
            onClick={() => setEditModal({ isOpen: true, data })}
            className="font-medium text-gray-600 hover:text-gray-800"
          >
            <MdModeEdit />
          </button>
        </td>
      );
    } else if (name === "Delete" || name === "Remove") {
      element = (
        <td className="self-center px-6 py-2 pt-4 text-lg text-center">
          <button
            onClick={remove}
            className="font-medium text-gray-600 hover:text-gray-800"
          >
            <MdDelete />
          </button>
        </td>
      );
    } else if (name === "Block/Unblock") {
      element = (
        <td className="self-center px-6 py-2 pt-4 text-lg text-center">
          <button
            onClick={handleBlock}
            className="font-medium text-red-600"
            title={blockUser ? "Unblock user" : "Block user"}
          >
            {blockUser ? <CgUnblock /> : <MdBlock />}
          </button>
        </td>
      );
    } else {
      element = <div>Action column not found!</div>;
    }

    return element;
  };

  return actionCols.map((item) => checkAction(item));
};

export default Actions;
