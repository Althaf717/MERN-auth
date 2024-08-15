import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DialogComponent from './DialogComponent';
import { useNavigate } from 'react-router-dom';

export default function CardComponent({user,setDeleteUser}) {
  const date = new Date(user.createdAt).toDateString();
  const navigate = useNavigate();

  const handleNavigate =()=>{
    navigate(`/admin/edit_user/${user._id}`);
  }

  const [open,setOpen] = React.useState(false);
  return (
    
    <Card className='m-1 w-full  text-center sm:w-52 mt-9 mx-3' >
      {
        <CardMedia
        className='object-cover bg-slate-400'
        sx={{ height: 160 }}
        component="img"
        image={user.profilePicture}
        alt="Profile Picture"
        title={user.username}
        onClick={handleNavigate}
      /> 
      }
      <CardContent className='bg-gray-900 text-white' >
        <Typography className='sm:' gutterBottom variant="" component="div">
          {user&&user.username}
        </Typography>
        <Typography className='text-xs text-gray-100' variant="">
          {user.email}
        </Typography>
        <p className='text-xs mt-2 text-gray-400'>
          Joined in {date}
        </p>
      </CardContent>
      <CardActions className='flex justify-between bg-slate-700' >
        <Button onClick={handleNavigate}  color='primary' size="small">Edit User</Button>
        <Button onClick={()=>setOpen(true)} variant='text' color='error' size="small">Delete</Button>
      </CardActions>
      <DialogComponent setDeleteUser={setDeleteUser} userId={user._id} open={open} setOpen={setOpen} />
    </Card>
    
  );
}