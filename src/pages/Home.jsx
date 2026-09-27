import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Software from "../components/Software";
import Experience from "../components/Experience";
import Projects from "../components/Projects";
import Certificates from "../components/Certificates";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Loader from "../components/Loader";

function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Software />
        <Experience />
        <Projects />
        <Certificates />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default Home;