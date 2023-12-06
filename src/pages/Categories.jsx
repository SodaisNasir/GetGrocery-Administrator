import GeneralPage from "./GeneralPage";
import { base_url } from "../utils/url";
import { useState, useEffect } from "react";
import { convertPropsToObject, fetchData, modifyData } from "../utils";

const neededProps = [
  { from: "category_id", to: "id" },
  "category_name",
  "image",
];
const template = convertPropsToObject(neededProps);
const showAllCategories = `${base_url}/fetch_category.php`;
const createUrl = `${base_url}/create_category.php`;
const editUrl = `${base_url}/edit_category.php`;

const Categories = () => {
  const [, setSearchText] = useState("");
  const [data, setData] = useState(null);
  const [reload, setReload] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paginatedData, setPaginatedData] = useState({
    items: [],
    curItems: [],
  });

  const search = (e) => {
    const str = e.target.value;
    setSearchText(str.trim());

    if (str.trim() === "") {
      setPaginatedData((prev) => ({ ...prev, items: data }));
    } else {
      setPaginatedData((prev) => ({
        ...prev,
        items: data.filter((item) =>
          Object.keys(template).some((key) =>
            String(item?.[key])?.toLowerCase()?.includes(str?.toLowerCase())
          )
        ),
      }));
    }
  };

  const editModalTemplate = {
    id: "",
  };

  const createModalTemplate = {
    id: "",
    person_name: "",
    company_tax_id: "",
    company_name: "",
    company_email: "",
    _password: "",
    _city: "",
    _company_address: "",
    _zip_code: "",
    _package_name: "",
    _package_id: "",
    _package_amount: "",
    _discount: "0",
    _gst: "0",
    status: "",
    _total: "",
  };

  const createCallback = (res) => {
    // const resData = modifyData(res?.success?.data, neededProps, true);
    // const newState = [resData, ...data];
    // setData(newState);
    // setPaginatedData((prev) => ({ ...prev, items: newState }));

    // console.log("response ===>", resData);
    setReload(!reload);
  };

  const editCallback = (res, state) => {
    const stateCopy = data?.map((e) =>
      e.id === state.id ? { ...e, ...state } : e
    );

    setData(stateCopy);
    setPaginatedData((prev) => ({ ...prev, items: stateCopy }));
  };

  const uploadFields = [
    {
      key: "image",
      title: "image",
    },
  ];

  const appendableFields = [
    {
      key: "id",
      appendFunc: (key, value, formdata) => {
        formdata.append("slider_id", value);
      },
    },
    {
      key: "image_url",
      appendFunc: (key, value, formdata) => {
        formdata.append("fileToUpload", value);
      },
    },
  ];

  const props = {
    title: "Categories",
    actionCols: ["Edit"],
    data,
    setData,
    template,
    isLoading,
    search: {
      type: "text",
      onChange: search,
      placeholder: "Search by Name, Email, Phone, Address...",
    },
    pagination: {
      paginatedData,
      setPaginatedData,
      curLength: paginatedData.items.length,
    },
    createModalProps: {
      uploadFields,
      appendableFields,
      excludeFields: ["id", "created_at", "updated_at"],
      hideFields: ["_package_name", "_package_amount"],
      dropdownFields,
      neededProps,
      createUrl,
      initialState: createModalTemplate,
      successCallback: createCallback,
    },
    editModalProps: {
      uploadFields,
      appendableFields,
      excludeFields: ["id", "created_at", "updated_at", "status", "_password"],
      dropdownFields,
      neededProps,
      editUrl,
      successCallback: editCallback,
      template: editModalTemplate,
    },
  };

  useEffect(() => {
    fetchData({
      neededProps,
      url: showAllCategories,
      setIsLoading,
      sort: (data) => data.sort((a, b) => b.id - a.id),
      callback: (data) => {
        setData(data);
        setPaginatedData((prev) => ({ ...prev, items: data }));
      },
    });
  }, []);

  return <GeneralPage {...props} />;
};

export default Categories;
