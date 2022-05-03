import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { Avatar, Button, List, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import { GalaxyI } from "../common/declarations";

export function GalaxyList(p: {
    list: GalaxyI[],
    onJoin: (g: GalaxyI) => void
}) {
    return <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {
            p.list.map(g => <ListItem key={g.props.name}
                secondaryAction={
                    <Button startIcon={<ArrowForwardRoundedIcon/>}>Join</Button>
                }
            >
                <ListItemAvatar>
                    <Avatar>
                        { g.props.name.substring(0,1).toUpperCase() }
                    </Avatar>
                </ListItemAvatar>
                <ListItemText 
                    primary={g.props.name} 
                    secondary={'People: ' + g.users.map(u => u.name).join(", ")} 
                />
            </ListItem>)
        }
    </List>
}