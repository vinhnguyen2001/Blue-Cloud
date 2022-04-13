const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.status(404).send(
        `
            <style> 

            html{
                text-align: center;
            }
            h1{
                margin-top:3rem;
                color:#e63946;
                margin-bottom:-1rem;
            }
            #iframe02{
                margin-bottom:10rem;
            }
            </style>
            <header>
            <title>Error 404</title>
            </header>
            <h1>Whoops, looks like something went wrong ! <h1>
           
            
            <img id="iframe02" width=480 height=509.133  src="../../../image/lolidance.gif" > </img>
            <audio loop id="mysong">
            <source src="../../audio/loli_dance_totally.mp3"  type="audio/mpeg">
            Your browser does not support the audio element
            </audio>
            
            <script type="text/javascript">
            const port = window.location.port;
            var mySong = document.getElementById("mysong");
            var image = document.getElementById("iframe02");
            
            image.onclick = function () {

                if (mysong.paused) {
                    mysong.play(); 
                }
                else {
                    mysong.pause();
                }
            }
            </script>
            
        `
    );
});

module.exports = router;