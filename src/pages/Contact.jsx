import { useState } from "react";

function Contact() {

const [message,setMessage]=useState("");

const [showHelp,setShowHelp]=useState(false);

return(

<div className="page-card">

<h1>Contact Me</h1>

<input

type="text"

placeholder="💌 Enter your message"

value={message}

onChange={(e)=>setMessage(e.target.value)}

/>

<p><b>Your Message</b></p>

<p>{message}</p>

<p><b>Characters :</b> {message.length}</p>

<button onClick={()=>setShowHelp(!showHelp)}>

{showHelp ? "Hide Help" : "Show Help"}

</button>

{showHelp &&

<p style={{marginTop:"15px"}}>

✨ Feel free to leave your message.

</p>

}

</div>

)

}

export default Contact;