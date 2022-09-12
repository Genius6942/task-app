import { Link } from "react-router-dom";
import { setDocumentTitle } from "../lib/utils";

export default function Home() {
  setDocumentTitle(null);
  return <Link to="/login">Login</Link>;
}
