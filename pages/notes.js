import { useEffect, useState } from "react"
import Image from 'next/image'
import styles from "../styles/Notes.module.css"
import { useRouter } from 'next/router'
import axios from "axios"
import Lottie from "lottie-react";
import loadingAnimation from "./loading.json";
import { Packer, Footer, Paragraph, Document, TextRun } from "docx";
import { saveAs } from "file-saver";

export default function Notes() {
    const [response, setResponse] = useState(null)
    const [points, setPoints] = useState(null)
    const [thumbnail, setThumbnail] = useState(null)
    const router = useRouter();

    useEffect(() => {
        if (router.query.videoId) {
            axios.post("http://127.0.0.1:5000", {
                youtube_video: router.query.videoId
            })
                .then(res => {
                    setThumbnail("https://img.youtube.com/vi/" + router.query.videoId + "/hqdefault.jpg")
                    setPoints(doStuff(res.data.response.notes))
                    console.log(doStuff(res.data.response.notes))
                    console.log(res.data.response.notes)

                    setResponse(res.data.response)
                })
        }
    }, [router.query])

    const doStuff = text => {
        const chunks = text.split(" ")
        let cur_point_num = 2
        let cur_point = " 1."
        let points = []

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];

            if (chunk === cur_point_num + ".") {
                console.log(cur_point_num)
                points.push(cur_point)
                cur_point = ""
                cur_point_num++
            }

            cur_point = cur_point + " " + chunk
        }

        return points
    }

    const renderPoints = () => {
        let arr = []

        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            arr.push(new Paragraph({
                children: [
                    new TextRun({
                        text: point,
                        size: 36,
                        break: 1
                    }),
                ],
            }))
        }
        return arr
    }

    const generateWordDoc = () => {
        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Notes for " + response.title,
                                    bold: true,
                                    size: 50
                                }),
                            ],
                        }),
                        ...renderPoints()
                    ],
                    footers: {
                        default: new Footer({ // The standard default footer on every page or footer on odd pages when the 'Different Odd & Even Pages' option is activated
                            children: [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: "Generated by EzNotes",
                                            bold: true,
                                            size: 30
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    },
                },
            ],
        });

        Packer.toBlob(doc).then(blob => {
            console.log(blob);
            saveAs(blob, "notes.docx");
            console.log("Document created successfully");
        });
    }

    return (
        <div>
            {response ? (
                <div className={styles.flexContainer}>
                    <div className={styles.container}>
                        <h1 className={styles.title}>{response.title}</h1>
                        <div className={styles.row}>
                            <p className={styles.author}>By <span className={styles.highlight}>{response.author}</span></p>
                            <button onClick={() => generateWordDoc()} className={styles.btnGenerate}>Generate Word Doc</button>
                        </div>
                        <img className={styles.thumbnail} src={thumbnail} />
                        {points.map(p => (
                            <p style={{ fontSize: 22 }}>{p}</p>
                        ))}
                    </div>
                </div>
            ) : (
                <div className={styles.loadingContainer}>
                    <Lottie animationData={loadingAnimation} style={{ width: 300, height: 300 }} />
                </div>
            )}
        </div>
    )
}