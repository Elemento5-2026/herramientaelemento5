import "./Fullscreen.css";

export default function Fullscreen({

    active,

    children

}) {

    if (!active) {

        return children;

    }

    return (

        <div className="fullscreen">

            {children}

        </div>

    );

}
