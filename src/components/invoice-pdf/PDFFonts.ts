import { Font } from "@react-pdf/renderer";
import IBMPlexSansItalic from "../../assets/fonts/IBMPlexSans-Italic.ttf";
import IBMPlexSans from "../../assets/fonts/IBMPlexSans-Regular.ttf";

Font.register({ family: "IBM Plex Sans", src: IBMPlexSans });
Font.register({ family: "IBM Plex Sans Italic", src: IBMPlexSansItalic });
