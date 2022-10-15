import { useEffect, useState } from "react"
import Image from 'next/image'
import styles from "../styles/Home.module.css"
import { useRouter } from 'next/router'

export default function Home() {
  const [video, setVideo] = useState(null)
  const [videoId, setVideoId] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const router = useRouter()

  useEffect(() => {
    if (video) {
      var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      var match = video.match(regExp);
      if (match && match[7].length==11) {
        setVideoId(match[7])
        setThumbnail("https://img.youtube.com/vi/" + match[7] + "/hqdefault.jpg")
      }
      else {
        setThumbnail(null)
        setVideoId(null)
      }
    }
    else {
      setVideoId(null)
      setThumbnail(null)
    }
  }, [video])

  return (
    <div>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>✏️ EzNotes | Simplify Learning</h1>
      </div>
      <div className={styles.descriptionContainer}>
        <p className={styles.description}>Forgot to make notes before class? Don't worry, we have got you covered.</p>
      </div>
      <div className={styles.inputContainer}>
        <input type="text" value={video} onChange={e => setVideo(e.target.value)} className={styles.input} placeholder="Enter a YouTube video link" />
      </div>
      <div className={styles.imgContainer}>
        <img onClick={() => router.push({ pathname: "/notes", query: { videoId } }, "notes")} src={thumbnail} className={styles.img} />
      </div>
    </div>
  )
}
