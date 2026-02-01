import type { Metadata } from "next";
import css from "./Home.module.css"

const TITLE = "Page Not Found";
const DESCRIPTION =
  "We couldn’t find that page. Try a different link or head back. ";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
      title: TITLE ,
      description: DESCRIPTION,
      siteName: 'NoteHub',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/og-meta.jpg',
          width: 1200,
          height: 630,
          alt: "NoteHub",
        },
      ],
      type: 'website',
    },

};

const NotFound = () => {

return (
    <div>
    <h1 className={css.title}>404 - Page not found</h1>
    <p className={css.description}>Sorry, the page you are looking for does not exist.</p>
    </div>
)
}
export default NotFound;