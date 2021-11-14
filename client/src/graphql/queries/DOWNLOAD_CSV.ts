import { gql } from "@apollo/client"
import { SearchParams } from "../../utils/types"

export const DOWNLOAD_CSV = gql`
  query downloadCSV($downloadSearchParams: DownloadSearchParamsInput) {
    downloadCSV(downloadSearchParams: $downloadSearchParams)
  }
`

export interface DownloadCSVQueryData {
  downloadCSV: string
}

export interface DownloadCSVQueryVariables {
  downloadSearchParams?: SearchParams | null
}