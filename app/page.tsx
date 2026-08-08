import Bio from "./Bio/Bio";
import Contacts from "./Contacts/Contacts";
import Footer from "./Footer/Footer";
import Hero from "./Hero/Hero";
import Navbar from "./Navbar/Navbar";
import ProjectsDisplay from "./ProjectsDisplay/ProjectsDisplay";
import Skills from "./Skills/Skills";


export default function Home() {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <Skills/>
      <ProjectsDisplay/>
      <Bio/>
      <Contacts/>
      <Footer/>
    </div>
  );
}
  