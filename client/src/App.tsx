import { hot } from "react-hot-loader";
import React, { useState, useEffect } from "react";
import { GetAthletesQueryData, GetAthletesQueryVariables, GET_ATHLETTES } from "./graphql/queries/GET_ATHLETES";
import { useQuery } from "@apollo/client";
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@material-ui/core';
import { Button, TextField } from "@mui/material";
import DownloadButton from "./components/DownloadButton";
import { SortKeys, SortValues } from "./utils/types";
import PlayersTable from "./components/PlayersTable";

const App = () => {
  const [playerName, setPlayerName] = useState("")
  const { data, fetchMore, loading, refetch } = useQuery<GetAthletesQueryData, GetAthletesQueryVariables>(GET_ATHLETTES, {
    variables: { searchParams: {
      playerName
    }},
  })

  const [sortSelections, setSortSelections] = useState(initSortSelections())
  const classes = useStyles()

  const searchParams = { playerName, ...sortSelections }

  useEffect(() => {
    refetch({ searchParams })
  },[playerName, sortSelections])

  if (!data) return null

  return (
    <TableContainer component={Paper}>
      {/* Search Query + Download Button */}
      <div>
        <TextField label="Search Player" variant="standard" value={playerName} onChange={handlePlayerSearch}/>
        <DownloadButton searchParams={searchParams}/>
      </div>

      {/* Data */}
      <PlayersTable 
        data={data} 
        handleSortClick={handleSortClick} 
        sortSelections={sortSelections}
      />

      {/* Load More */}
      {
        data.athletes.pageInfo.hasNextPage &&
        <div className={classes.loadMoreContainer}>
          <Button onClick={handleLoadMore} disabled={loading}>Load More</Button>
        </div>
      }
    </TableContainer>
  )

  function handlePlayerSearch(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
    setPlayerName(e.target.value)
  }

  function handleLoadMore() {
    fetchMore({
      variables: {
        after: data?.athletes.pageInfo.endCursor,
      }
    })
  }

  function handleSortClick(key: SortKeys) {
    setSortSelections(prev => {
      const newSortSelections = initSortSelections()
  
      if (!prev[key]) {
        // null/undefined -> DSC
        newSortSelections[key] = "DSC"
      } else if (prev[key] === "DSC") {
        // DSC -> ASC
        newSortSelections[key] = "ASC"
      } else if (prev[key] === "ASC") {
        // ASC -> null
        newSortSelections[key] = null
      }
  
      return newSortSelections
    })
  }
  
  function initSortSelections(): Record<SortKeys, SortValues> {
    return {
      totalYards: null,
      longest: null,
      touchdowns: null,
    }
  }
};

const useStyles = makeStyles(() => ({
  loadMoreContainer: {
    display: "flex",
    justifyContent: "center",
  }
}))

export default hot(module)(App);