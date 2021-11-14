import React from "react"
import { parse } from "json2csv"
import { Button } from "@mui/material"
import { useQuery } from "@apollo/client"
import { DownloadCSVQueryData, DownloadCSVQueryVariables, DOWNLOAD_CSV } from "../graphql/queries/DOWNLOAD_CSV"
import { downloadBlob } from "../utils/downloadUtils"
import { SearchParams } from "../utils/types"

interface DownloadButtonProps {
  searchParams: SearchParams
}

function DownloadButton({ searchParams }: DownloadButtonProps) {
  const { refetch } = useQuery<DownloadCSVQueryData, DownloadCSVQueryVariables>(DOWNLOAD_CSV, { skip: true })

  return (
    <Button onClick={handleDownload}>{"Download"}</Button>
  )

  function handleDownload() {
    refetch({ downloadSearchParams: searchParams })
    .then(res => {
      const jsonData = JSON.parse(res.data.downloadCSV)
      const csv = parse(jsonData, { fields })
      
      const blob = new Blob([csv], { type: "text/csv" })
      const downloadLink = downloadBlob(blob, "player-data.csv")

      document.body.appendChild(downloadLink)
      downloadLink.click()
    })
  }
}

const fields = [
  {
    label: "Player",
    value: "name",
  }, 
  {
    label: "Team",
    value: "team",
  }, 
  {
    label: "Pos",
    value: "position",
  }, 
  {
    label: "Att",
    value: "attempts",
  }, 
  {
    label: "Att/G",
    value: "attemptsPerGame",
  }, 
  {
    label: "Yds",
    value: "totalYards",
  }, 
  {
    label: "Avg",
    value: "averageYardsPerAttempt",
  }, 
  {
    label: "Yds/G",
    value: "yardsPerGame",
  }, 
  {
    label: "TD",
    value: "touchdowns",
  }, 
  {
    label: "Lng",
    value: "longest",
  }, 
  {
    label: "1st",
    value: "firstDowns",
  }, 
  {
    label: "1st%",
    value: "firstDownsPercentage",
  }, 
  {
    label: "20+",
    value: "twentyPlusYards",
  }, 
  {
    label: "40+",
    value: "fourtyPlusYards",
  }, 
  {
    label: "FUM",
    value: "fumbles",
  }
]

export default DownloadButton