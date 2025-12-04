import Image from "next/image";
import Homepage from "@/client/dashboard"
import {  DashboardProvider} from "@/client/Store/container";

export default function Home() {
  return (
    <DashboardProvider>
    <Homepage/>
    </DashboardProvider>
  );
}
