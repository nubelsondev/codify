import { Router } from 'express';

import api from '../services/api';

const userRouter = Router();

interface ITracks {
  [key: string]: string;
}

interface IImages {
  url: string;
}

interface IArtistFollwers {
  total: number;
}

interface ITopArtists {
  id: string;
  name: string;
  images: IImages[];
  type: string;
  uri: string;
  followers: IArtistFollwers;
  popularity: number;
  topTrackPreview: string;
  topTrackName: string;
}

interface IPlaylists {
  id: string;
  name: string;
  images: IImages[];
  uri: string;
}

userRouter.get('/', async (req, res) => {
  const response = await api.get('/me');

  const { id, type, display_name, email, images } = response.data;

  const user = {
    id,
    type,
    display_name,
    email,
    avatar: images[0].url,
  };

  return res.json(user);
});

userRouter.get('/top-artists', async (req, res) => {
  const response = await api.get('/me/top/artists', {
    params: {
      limit: 5,
    },
  });

  const artists: ITopArtists[] = response.data.items;

  await Promise.all(
    artists.map(async artist => {
      const tracksResponse = await api.get(
        `/artists/${artist.id}/top-tracks?country=BR`,
      );

      Object.assign(artist, {
        topTrackPreview: tracksResponse.data.tracks[0].preview_url,
        topTrackName: tracksResponse.data.tracks[0].name,
      });
    }),
  );

  return res.json(artists);
});

userRouter.get('/playlists', async (req, res) => {
  const response = await api.get('/me/playlists');

  const playlists: IPlaylists[] = response.data.items;

  const formattedPlaylists = playlists.map(playlist => ({
    id: playlist.id,
    name: playlist.name,
    avatar: playlist.images[0].url,
    uri: playlist.uri,
  }));

  return res.json(formattedPlaylists);
});

// userRouter.get("/recently-played", async (req, res) => {
//   const response = await api.get("/me/player/recently-played");

//   console.log(response.data);
//   // const { id, type, display_name, email, images } = response.data;

//   // const user = {
//   //   id,
//   //   type,
//   //   display_name,
//   //   email,
//   //   avatar: images[0].url,
//   // };

//   return res.json(response.data);
// });

export default userRouter;
