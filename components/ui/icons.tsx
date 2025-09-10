import { Loader2 } from 'lucide-react';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { IconType } from 'react-icons';

type Icon = IconType;

export const Icons = {
  spinner: Loader2,
  google: FaGoogle as Icon,
  gitHub: FaGithub as Icon,
};
