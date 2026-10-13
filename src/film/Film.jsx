import { useReducedMotion } from 'framer-motion';
import TitleCard from './scenes/TitleCard';
import Question from './scenes/Question';
import Connect from './scenes/Connect';
import Agents from './scenes/Agents';
import Build from './scenes/Build';
import Stay from './scenes/Stay';

export default function Film() {
  const reduced = useReducedMotion();
  return (
    <>
      <TitleCard reduced={reduced} />
      <Question reduced={reduced} />
      <Connect reduced={reduced} />
      <Agents reduced={reduced} />
      <Build reduced={reduced} />
      <Stay reduced={reduced} />
    </>
  );
}
