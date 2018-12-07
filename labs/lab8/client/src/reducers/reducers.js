import auth from './auth';
import tracks from './tracks';
import users from './users';
import player from './player';
import playlists from './playlists';
import { combineReducers } from 'redux';

export default combineReducers({
    auth,
    tracks,
    users,
    player,
    playlists
}); 