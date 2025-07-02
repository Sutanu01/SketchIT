
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
} from "@headlessui/react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import userImage from "../assets/icons8-male-user-50.png";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";

const navigation = [
  { name: "Home", href: "/" },
  { name: "My sketch", href: "/mysketch" },
];
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}

export default function Navbar(props) {
  const { user, updateUser } = useUser();
  const [open, setOpen] = useState(false);
  const [ProfileImage, setProfileImage] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      updateUser();
    }
  }, [updateUser]);
  let location = useLocation();
  const navigate = useNavigate();

  const handleClick = (e) => {
    setOpen(false);
    localStorage.removeItem("token");
    navigate("/login");
  };

  const createProfile = async (newImage) => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/uploadpp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          AuthToken: localStorage.getItem("token"),
        },
        body: JSON.stringify({ profilephoto: newImage }),
      });
      const json = await response.json();
      if (json.success) {
        updateUser();
        props.showAlert("Profile Picture changed successfully !", "success");
      } else {
        props.showAlert("Invalid try again", "danger");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createProfile(ProfileImage);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setProfileImage(base64);
  };

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <lord-icon
                    src="https://cdn.lordicon.com/wuvorxbv.json"
                    trigger="hover"
                    stroke="bold"
                    colors="primary:#ffffff,secondary:#30e8bd"
                  ></lord-icon>
                </div>
                <div className="mr-20 ml-8 text-white font-bold text-3xl">
                  Sketch It
                </div>
                <div className="hidden md:block">
                  <div className=" flex items-baseline space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        aria-current={
                          location.pathname === item.href ? "page" : undefined
                        }
                        className={classNames(
                          location.pathname === item.href
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  {localStorage.getItem("token") ? (
                    <Menu as="div" className=" relative ml-3">
                      <div>
                        <MenuButton
                          onClick={() => {
                            setOpen(true);
                          }}
                          className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          <img
                            alt=""
                            src={user.imageUrl}
                            className={
                              user.imageUrl === userImage
                                ? "h-10 w-10 rounded-full invert"
                                : "h-10 w-10 rounded-full"
                            }
                          />
                        </MenuButton>
                      </div>
                    </Menu>
                  ) : (
                    <div>
                      <div className="flex gap-6 my-5 p-1">
                        <Link
                          className="bg-transparent hover:bg-gray-500 text-gray-300 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded"
                          to="/login"
                        >
                          Login
                        </Link>
                        <Link
                          className="bg-transparent hover:bg-gray-500 text-gray-300 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded"
                          to="/signup"
                        >
                          SignUp
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="-mr-2 flex md:hidden">
                <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon
                    aria-hidden="true"
                    className="block h-6 w-6 group-data-[open]:hidden"
                  />
                  <XMarkIcon
                    aria-hidden="true"
                    className="hidden h-6 w-6 group-data-[open]:block"
                  />
                </DisclosureButton>
              </div>
            </div>
          </div>

          <DisclosurePanel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  aria-current={
                    location.pathname === item.href ? "page" : undefined
                  }
                  className={classNames(
                    location.pathname === item.href
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            {localStorage.getItem("token") && (
              <div className="border-t border-gray-700 pb-3 pt-4">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <img
                      alt=""
                      src={user.imageUrl}
                      className={
                        user.imageUrl === userImage
                          ? "h-12 w-12 rounded-full invert"
                          : "h-12 w-12 rounded-full"
                      }
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-white">
                      {user.name}
                    </div>
                    <div className="text-sm font-medium leading-none text-gray-400">
                      {user.email}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex gap-6 mx-10 my-5 pb-8">
              {localStorage.getItem("token") ? (
                <DisclosureButton
                  className="bg-transparent hover:bg-gray-500 text-gray-300 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded"
                  onClick={handleClick}
                >
                  Logout
                </DisclosureButton>
              ) : (
                <>
                  <Link
                    className="bg-transparent hover:bg-gray-500 text-gray-300 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded"
                    to="/login"
                  >
                    Login
                  </Link>
                  <Link
                    className="bg-transparent hover:bg-gray-500 text-gray-300 font-semibold hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded"
                    to="/signup"
                  >
                    SignUp
                  </Link>{" "}
                </>
              )}
            </div>
          </DisclosurePanel>
        </Disclosure>
      </div>

      {
        //-----------------------------------------------------User Page--------------------------------------
      }
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <DialogPanel
                transition
                className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
              >
                <TransitionChild>
                  <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 duration-500 ease-in-out data-[closed]:opacity-0 sm:-ml-10 sm:pr-4">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <span className="absolute -inset-2.5" />
                      <span className="sr-only">Close panel</span>
                      <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                    </button>
                  </div>
                </TransitionChild>
                <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                  <div className="px-4 sm:px-6">
                    <DialogTitle className="flex text-2xl justify-center font-bold leading-6 text-gray-900">
                      User Profile
                    </DialogTitle>
                  </div>
                  <hr className="w-10/12 h-1 mx-auto my-4 bg-gray-100 border-0 rounded md:my-10 dark:bg-gray-700" />
                  <div className="justify-center align-baseline relative mt-6 flex-1 px-4 sm:px-6">
                    <div className="flex justify-center align-baseline">
                      <form onSubmit={handleSubmit}>
                        <label htmlFor="file-upload">
                          <img
                            src={user.imageUrl}
                            alt="Profile"
                            className="h-20 w-20 rounded-full outline"
                          />
                        </label>
                        <input
                          type="file"
                          id="file-upload"
                          accept=".jpeg, .png, .jpg"
                          onChange={handleFileUpload}
                          style={{ display: "none" }}
                        />
                        {/* <div>choose profile picture to upload</div> */}
                        <button
                          type="submit"
                          className="bg-blue-500 text-white px-4 py-2 rounded mt-10"
                        >
                          Upload
                        </button>
                      </form>
                    </div>
                    <div className="w-full flex justify-center ">
                    <div className="mt-20 w-10/12">
                      <div className="flex items-baseline mb-2">
                        <div className="font-extrabold text-xl w-1/3">
                          Username
                        </div>
                        <span className="w-1/12 text-xl text-center">:</span>
                        <div className="w-2/3 text-lg text-teal-800">{user.name}</div>
                      </div>
                      <div className="flex items-baseline">
                        <div className="font-extrabold text-xl w-1/3">
                          Email
                        </div>
                        <span className="w-1/12 text-xl text-center">:</span>
                        <div className="w-2/3 text-lg text-teal-800">{user.email}</div>
                      </div>
                    </div>
                    </div>
                    
                  </div>
                  <div className="m-10">
                    {localStorage.getItem("token") ? (
                      <button
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        onClick={handleClick}
                      >
                        Logout
                      </button>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
