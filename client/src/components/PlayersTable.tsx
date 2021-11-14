import { Table, TableHead, TableRow, TableCell, IconButton, TableBody } from "@mui/material";
import { makeStyles } from "@material-ui/core"
import React from "react";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Edge, SearchParams, SortKeys, SortValues } from "../utils/types";
import { GetAthletesQueryData } from "../graphql/queries/GET_ATHLETES";

interface PlayersTableProps {
  data: GetAthletesQueryData
  handleSortClick: (key: SortKeys) => void
  sortSelections: Record<SortKeys, SortValues>
}

function PlayersTable({ data, handleSortClick, sortSelections }: PlayersTableProps) {
  const classes = useStyles({ ...sortSelections })

  return (
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Player</TableCell>
          <TableCell align="center">Team</TableCell>
          <TableCell align="center">Pos</TableCell>
          <TableCell align="center">Att</TableCell>
          <TableCell align="center">Att/G</TableCell>
          <TableCell align="center">
            Yds
            <IconButton onClick={() => handleSortClick("totalYards")} >
              <ChevronRightIcon className={classes.sortTotalYardsChevron}/>
            </IconButton>
          </TableCell>
          <TableCell align="center">Avg</TableCell>
          <TableCell align="center">Yds/G</TableCell>
          <TableCell align="center">
            TD
            <IconButton onClick={() => handleSortClick("touchdowns")}>
              <ChevronRightIcon className={classes.sortTouchdownsChevron} />
            </IconButton>
          </TableCell>
          <TableCell align="center">
            Lng
            <IconButton onClick={() => handleSortClick("longest")}>
              <ChevronRightIcon className={classes.sortLongestChevron} />
            </IconButton>
          </TableCell>
          <TableCell align="center">1st</TableCell>
          <TableCell align="center">1st%</TableCell>
          <TableCell align="center">20+</TableCell>
          <TableCell align="center">40+</TableCell>
          <TableCell align="center">FUM</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {
          data.athletes.edges.map((edge: Edge, index: number) => (
            <TableRow key={`${edge.node.name}${index}`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell>{ edge.node.name }</TableCell>
              <TableCell align="center">{ edge.node.team }</TableCell>
              <TableCell align="center">{ edge.node.position }</TableCell>
              <TableCell align="center">{ edge.node.attempts }</TableCell>
              <TableCell align="center">{ edge.node.attemptsPerGame }</TableCell>
              <TableCell align="center">{ edge.node.totalYards }</TableCell>
              <TableCell align="center">{ edge.node.averageYardsPerAttempt }</TableCell>
              <TableCell align="center">{ edge.node.yardsPerGame }</TableCell>
              <TableCell align="center">{ edge.node.touchdowns }</TableCell>
              <TableCell align="center">{ edge.node.longest }</TableCell>
              <TableCell align="center">{ edge.node.firstDowns }</TableCell>
              <TableCell align="center">{ edge.node.firstDownsPercentage }</TableCell>
              <TableCell align="center">{ edge.node.twentyPlusYards }</TableCell>
              <TableCell align="center">{ edge.node.fourtyPlusYards }</TableCell>
              <TableCell align="center">{ edge.node.fumbles }</TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  )
}

type StyleProps = Pick<SearchParams, "totalYards" | "longest" | "touchdowns">

const useStyles = makeStyles(() => ({
  sortTotalYardsChevron: ({ totalYards }: StyleProps) => ({
    transform: `rotate(${calculateRotation(totalYards)}deg)`
  }),
  sortLongestChevron: ({ longest }: StyleProps) => ({
    transform: `rotate(${calculateRotation(longest)}deg)`
  }),
  sortTouchdownsChevron: ({ touchdowns }: StyleProps) => ({
    transform: `rotate(${calculateRotation(touchdowns)}deg)`
  }),
}))

function calculateRotation(direction?: SortValues) {
  if (direction === "ASC") {
    return 270
  } else if (direction === "DSC") {
    return 90
  } else {
    return 0
  }
}

export default PlayersTable