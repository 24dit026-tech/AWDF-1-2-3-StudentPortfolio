import Header from "./components/Header";
import About from "./components/About";
import Skills from "./components/Skills";
import Footer from "./components/Footer";

function App() {
  const skills = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Vite"
  ];

  return (
    <>
      <Header name="Prisha Kalola" />
      <About />
      <Skills skillList={skills} />
      <Footer />
    </>
  );
}

export default App;