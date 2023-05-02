import { Navigate } from "react-router-dom";
import AsImgGallery from "../components/Home/AsImgGallery";

export default function Home() {
  if (localStorage.getItem('token') === null) {
    return <Navigate to={'/login'} />
  };
  return (
    <>
      <AsImgGallery />
    </>
  );
}