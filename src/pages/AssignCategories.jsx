import { useContext, useEffect, useState } from "react";
import { convertPropsToObject, fetchData } from "../utils";
import { base_url } from "../utils/url";
import { AppContext } from "../context";
import { useParams } from "react-router-dom";
import GeneralPage from "./GeneralPage";

const neededProps = ["category_id", "sub_category_id", "sub_category_name"];
const template = convertPropsToObject(neededProps);
const showAllCategory = `${base_url}/get_assigned_sub_categories.php`;
const showAllSubCategory = `${base_url}/get_sub_categories.php`;
const createUrl = `${base_url}/assign_sub_categories.php`;

const AssignCategories = () => {
  const { id: category_id } = useParams();
  const { user } = useContext(AppContext);
  const [, setSearchText] = useState("");
  const [data, setData] = useState(null);
  const [reload, setReload] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subCategories, setSubCategories] = useState(null);
  const [paginatedData, setPaginatedData] = useState({
    items: [],
    curItems: [],
  });

  const deleteUrl = (data) => {
    const formdata = new FormData();
    formdata.append("token", user?.token);
    formdata.append("category_id", category_id);
    formdata.append("sub_category_id", data.sub_category_id);
    const requestOptions = {
      headers: {
        accept: "application/json",
      },
      method: "POST",
      body: formdata,
      redirect: "follow",
    };
    return [
      `${base_url}/delete_category_sub_category_relation.php`,
      requestOptions,
    ];
  };

  const search = (e) => {
    const str = e.target.value;
    setSearchText(str.trim());

    if (str.trim() === "") {
      setPaginatedData((prev) => ({ ...prev, items: data }));
    } else {
      setPaginatedData((prev) => ({
        ...prev,
        items: data.filter(
          (item) =>
            item?.sub_category_name
              ?.toLowerCase()
              ?.includes(str?.toLowerCase()) ||
            String(item?.sub_category_id)
              ?.toLowerCase()
              ?.includes(str?.toLowerCase()) ||
            String(item?.category_id)
              ?.toLowerCase()
              ?.includes(str?.toLowerCase())
        ),
      }));
    }
  };

  const createModalTemplate = {
    sub_category_id: "",
  };

  const createCallback = (res) => {
    setReload(!reload);
  };

  const appendableFields = [
    {
      key: "sub_category_id",
      appendFunc: (key, value, formdata) => {
        const subCat = subCategories.find((e) => e.id == value);
        console.log("value", value);
        formdata.append("category_id", category_id);
        formdata.append("sub_category_id", value);
        formdata.append("sub_category_name", subCat.name?.[0]?.value);
      },
    },
  ];

  const dropdownFields = [
    {
      key: "sub_category_id",
      title: "sub_category",
      arr: subCategories,
      getOption: (val) => val?.name?.[0]?.value,
      getValue: (val) => val?.id,
    },
  ];

  const props = {
    title: "Assign Categories",
    actionCols: ["Delete"],
    data,
    setData,
    template,
    isLoading,
    deleteUrl,
    search: {
      type: "text",
      onChange: search,
      placeholder: "Search by Sub Category Name and IDs",
    },
    pagination: {
      paginatedData,
      setPaginatedData,
      curLength: paginatedData.items.length,
    },
    createModalProps: {
      createUrl,
      neededProps,
      hideFields: [],
      dropdownFields,
      appendableFields,
      excludeFields: ["id", "created_at", "updated_at"],
      initialState: createModalTemplate,
      successCallback: createCallback,
      gridCols: 1,
    },
  };

  const fetchSubCats = async () => {
    try {
      const res = await fetch(showAllSubCategory);
      const json = await res.json();

      console.log("json", json);
      if (json.status) {
        setSubCategories(json.data.categories);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const formdata = new FormData();
    formdata.append("token", user?.token);
    formdata.append("category_id", category_id);
    const requestOptions = {
      headers: {
        accept: "application/json",
      },
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    fetchData({
      neededProps,
      setIsLoading,
      requestOptions,
      url: showAllCategory,
      sort: (data) => data.sort((a, b) => b.id - a.id),
      callback: (data) => {
        const newState = data.map((e) => ({ ...e, _id: e.sub_category_id }));
        setData(newState);
        setPaginatedData((prev) => ({ ...prev, items: newState }));
      },
    });

    fetchSubCats();
  }, [reload, user.token, category_id]);

  return <GeneralPage {...props} />;
};

export default AssignCategories;
