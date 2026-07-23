import Image, { type ImageProps } from "next/image";
import Dashboard from "./components/Dashboard";





export default function Home() {
  return (
    <div className="bg-slate-600 text-2xl">
      hi we are on the frontend page 
      <Dashboard/>
    </div>
  );
}
