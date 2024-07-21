import { Collapse, Container, Stack } from "@mui/material"
import MyEvents from "./components/MyEvents";
import MyTasks from "./components/MyTasks";
import MyParticipants from "./components/MyParticipants";
import FloatingActionButtons from "./components/FloatingActionButtons";
import { useRecoilValue } from "recoil";
import eventFormState from "./app/recoil/eventFormAtom";
import EventForm from "./components/EventForm";

function App() {

  const eventForm = useRecoilValue(eventFormState)

  return (
    <Container maxWidth={"lg"}>
      <Collapse in={!eventForm}>
        <Stack display={"flex"} direction={"row"} sx={{
            position: "relative"
          }}>
          <Stack sx={{
            height: '100vh',
          }} flex={6}>
            <MyEvents />
          </Stack>
          <Stack sx={{
            height: '100vh',
          }} flex={4}>
            <MyTasks />
            <MyParticipants />
          </Stack>
          <FloatingActionButtons />
        </Stack>
      </Collapse>
      <Collapse in={!!eventForm}>
          <EventForm />
      </Collapse>
    </Container>
  )
}

export default App
