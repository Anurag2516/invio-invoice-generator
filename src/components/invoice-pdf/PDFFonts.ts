import { Font } from "@react-pdf/renderer";
import DMSans from "../../assets/fonts/DMSans_24pt-Regular.ttf";
import DMSerifDisplay from "../../assets/fonts/DMSerifDisplay-Regular.ttf";
import DMSerifDisplayItalic from "../../assets/fonts/DMSerifDisplay-Italic.ttf";
import Epilogue from "../../assets/fonts/Epilogue-Regular.ttf";
import IBMPlexMono from "../../assets/fonts/IBMPlexMono-Regular.ttf";

Font.register({ family: "DM Sans", src: DMSans });
Font.register({ family: "DM Serif Display", src: DMSerifDisplay });
Font.register({ family: "DM Serif Display Italic", src: DMSerifDisplayItalic });
Font.register({ family: "Epilogue", src: Epilogue });
Font.register({ family: "IBM Plex Mono", src: IBMPlexMono });
