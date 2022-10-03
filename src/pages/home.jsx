import { Link } from "react-router-dom";

import { hideSplash, setDocumentTitle } from "../lib/utils";

export default function Home() {
  setDocumentTitle(null);
  hideSplash();
  return <Link to="/login">Login</Link>;
}
