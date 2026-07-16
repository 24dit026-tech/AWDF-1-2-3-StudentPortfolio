import Header from "../components/Header";
import About from "../components/About";
import Skills from "../components/Skills";
import Footer from "../components/Footer";

function Home() {
  const skills = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Vite"
  ];

  return (
    <>
      <Header
        name="Prisha Kalola"
        themeColor="#2563eb"
      />

      <About />

      <Skills skillList={skills} />

      <Footer />
    </>
  );
}

export default Home;