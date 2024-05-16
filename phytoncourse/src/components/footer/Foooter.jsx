import React, { useState } from "react";
import logo from "../../img/logo.png";
import vk from "../../img/VK.png";
import github from "../../img/github.png";
import "./Footer.scss";

const Footer = () => {
 
  return (
    <footer>
    <div class="container row">
        <a href="/"><img class="logo" src={logo} alt="MAP"></img></a>
        <div class="social">
            <a href="/"><img src={vk} alt="VK" class=""></img></a>
            <a href="/"><img src={github} alt="Github"></img></a>
        </div>
    </div>
    
    
</footer>
  )
}
 
export default Footer