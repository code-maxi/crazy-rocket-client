import Alert from 'react-bootstrap/Alert'
import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Spinner from 'react-bootstrap/Spinner'
import Card from 'react-bootstrap/Card'
import Stack from 'react-bootstrap/Stack'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { BootIcon } from '../../gui-adds'

import React from "react";
import { Galaxy2I, GalaxyI, GalaxyStateT, ResponseResult, RocketTeamColorT, UserPropsI } from "../../common/declarations"
import { getConnection } from "../network/SocketUser"
import { ButtonGroup, Collapse } from 'react-bootstrap'
import { gameData, gameHelper } from '../object-functions/game'

interface GalaxyViewParams {
    galaxy: string,
    debug?: {
        name: string,
        team: string,
        password: string
    }
}

interface GalaxyViewState {
    galaxyData?: Galaxy2I,
    errorMessage?: ResponseResult,
    joinedUser?: UserPropsI
}

export class GalaxyView extends React.Component<GalaxyViewParams, GalaxyViewState> {
    nameValue = ''

    constructor(p: any) {
        super(p)
        this.state = {
            galaxyData: {
                props: {
                    name: this.props.galaxy,
                    state: "queue"
                },
                users: [
                    {
                        id: "1",
                        name: "User 1",
                        galaxy: this.props.galaxy
                    },
                    {
                        id: "2",
                        name: "User 2",
                        galaxy: this.props.galaxy
                    },
                    {
                        id: "3",
                        name: "User 3",
                        galaxy: this.props.galaxy
                    }
                ],
                teams: [
                    {
                        props: {
                            galaxyName: this.props.galaxy,
                            name: "Team Rot",
                            color: "red",
                            maxUserSize: 3
                        },
                        userIds: ["1"]
                    },
                    {
                        props: {
                            galaxyName: this.props.galaxy,
                            name: "Team Blau",
                            color: "blue",
                            maxUserSize: 3
                        },
                        userIds: ["2"]
                    },
                    {
                        props: {
                            galaxyName: this.props.galaxy,
                            name: "Team Grün",
                            color: "green",
                            maxUserSize: 3
                        },
                        userIds: ["3"]
                    }
                ],
                config: {
                    asteroidAmount: 100,
                    asteroidSpeed: 10
                }
            }
        }
    }

    render(): React.ReactNode {
        const galData = this.state.galaxyData
        return <Container fluid style={{
            background: 'linear-gradient(40deg, #ae6565, #4f4fee)',
            height: '100vh',
            position: 'fixed',
            overflow: 'auto'
        }}>
            <Row className="justify-content-center align-items-center mt-5 mb-5">
            {
                galData ? <Card style={{
                    width: 'max-content',
                    minWidth: '300px',
                    position: 'relative'
                }} className="shadow-lg">
                    <img src='images/round-rocket.png' style={{
                        position: 'absolute',
                        top: '-20px',
                        right: '10px',
                        width: '70px',
                        height: '70px',
                        transform: 'rotate(-10deg)'
                    }} />

                    <Card.Body>
                        <Card.Title>{'Galaxy \"' + galData.props.name +"\""}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{ galData.teams.length + ' Teams, ' + galData.users.length + ' Users, ' + ( galData.props.state === 'queue' ? 'not ran yet' : 'running' ) }</Card.Subtitle>

                        <div className="justify-content-center d-flex mb-3">
                            <ButtonGroup className="ml-auto mr-auto mt-2">
                                <Button variant="outline-primary">{BootIcon({ button: true }).ADD_PERSON} Invite Somone via Link</Button>
                                {
                                    this.state.joinedUser ? (
                                        galData.props.state === 'queue' ? 
                                            <Button variant="outline-primary" onClick={() => { this.setState({...this.state, galaxyData: { ...this.state.galaxyData!, props: { ...this.state!.galaxyData!.props, state: 'running' } }}) }}>{BootIcon({ button: true }).TRIANGLE} Run Game as Admin</Button> 
                                            : <Button variant="primary">→ Join running Game</Button> 
                                    ) : undefined
                                }
                            </ButtonGroup>
                        </div>

                        <Card.Text>
                            <GalaxyViewTip user={ this.state.joinedUser } galaxyState={ galData.props.state } galaxyName={ galData.props.name } />
                        </Card.Text>

                        <RocketTeamList galaxy={galData} onUserJoin={team => {
                            this.setState({ ...this.state, joinedUser: {
                                id: "3",
                                name: this.nameValue,
                                galaxy: this.props.galaxy,
                                teamName: team
                            }}) 
                        }} />
                        
                        <Collapse in={ this.state.joinedUser === undefined }>
                            <InputGroup className="mb-3">
                                <InputGroup.Text id="basic-addon1">{ BootIcon().USER_ICON }</InputGroup.Text>
                                <Form.Control
                                    placeholder="Your Nickname for the Game..."
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    onChange={e => {
                                        this.nameValue = e.target.value as string
                                    }}
                                />
                            </InputGroup>
                        </Collapse>
                    </Card.Body>
                </Card> : <Spinner animation="border" />
            }
            </Row>
        </Container>
    }
}

export function bootTeamColor(c: RocketTeamColorT) {
    var res: string | undefined = undefined
    if (c === 'blue') res = 'primary'
    if (c === 'red') res = 'danger'
    if (c === 'green') res = 'success'
    if (c === 'yellow') res = 'warning'
    return res!
}

function GalaxyViewTip(p: {
    user?: UserPropsI,
    galaxyState: GalaxyStateT,
    galaxyName: string,
}) {
    return <div className='d-flex justify-content-center'>
        <Alert variant="info" style={{ maxWidth: '400px' }}>
            { !p.user ? "Hi there, welcome to the Galaxy \"" + p.galaxyName + "\"! You can join a team by specifying your name below and then clicking on the \"Join\" button of the selected Team." : '' }
            { p.user ? "Great " + p.user.name + ", you joined the Team \"" + p.user.teamName + "\". " : '' }
            { p.user && p.galaxyState === 'queue' ? "The Game hasn't been ran yet so you have to wait until the administrator runs it." : '' }
            { p.user && p.galaxyState === 'running' ? "The Game is now running and you can join it by clicking on the button \"Join Running Game\" above." : '' }
        </Alert>
    </div>
}

function RocketTeamList(p: {
    galaxy: Galaxy2I,
    onUserJoin: (teamName: string) => void
}) {
    return <ListGroup variant="flush" className='mb-4'>
        {
            p.galaxy.teams.map(team => 
                <ListGroup.Item className={'mb-2 rounded text-white bg-' + bootTeamColor(team.props.color)}>
                    <Stack direction="horizontal" className="align-items-center" gap={3}>
                        <p className="fs-5 mb-0">{team.props.name}</p>
                        <p className="fs-7 mb-0">{team.userIds.map(id => p.galaxy.users.find(u => u.id == id)?.name).join(", ")}</p>
                        <Button variant='light' className='ms-auto' onClick={() => { p.onUserJoin(team.props.name) }}>→ Join</Button>
                    </Stack>
                </ListGroup.Item>
            )
        }
    </ListGroup>
}