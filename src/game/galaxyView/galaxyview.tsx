import Feedback from 'react-bootstrap/Feedback'
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
import { Galaxy2I, GalaxyI, GalaxyPrevI, GalaxyStateT, ResponseResult, RocketTeamColorT, UserPropsI } from "../../common/declarations"
import { getConnection, SocketUser } from "../network/SocketUser"
import { ButtonGroup, Collapse } from 'react-bootstrap'

interface GalaxyViewParams {
    noGalaxySpecifyed: boolean
}

interface GalaxyViewState {
    galaxy?: Galaxy2I,
    error?: {
        message: string | null,
        type: string
    },
    myUser?: UserPropsI
}

const exampleGalaxyViewState: GalaxyViewState = {
    galaxy: {
        props: {
            name: 'test-galaxy',
            state: "queue"
        },
        users: [
            {
                id: "1",
                name: "User 1",
                galaxy: 'test-galaxy'
            },
            {
                id: "2",
                name: "User 2",
                galaxy: 'test-galaxy'
            },
            {
                id: "3",
                name: "User 3",
                galaxy: 'test-galaxy'
            }
        ],
        teams: [
            {
                props: {
                    galaxyName: 'test-galaxy',
                    name: "Team Rot",
                    color: "red",
                    maxUserSize: 3
                },
                userIds: ["1"]
            },
            {
                props: {
                    galaxyName: 'test-galaxy',
                    name: "Team Blau",
                    color: "blue",
                    maxUserSize: 3
                },
                userIds: ["2"]
            },
            {
                props: {
                    galaxyName: 'test-galaxy',
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
    },
    error: {
        type: 'inlid-text',
        message: 'Der Name ist zu kurz.'
    }
}

export class GalaxyView extends React.Component<GalaxyViewParams, GalaxyViewState> {
    static instance: GalaxyView
    
    nameValue = ''

    constructor(p: any) {
        super(p)
        this.state = {}
        GalaxyView.instance = this
    }

    setErrorResult(res: ResponseResult) {
        if (!res.successfully && res.errorType) {
            this.setState({
                ...this.state,
                error: {
                    message: res.message,
                    type: res.errorType
                }
            })
        } else this.setState({
            ...this.state,
            error: undefined
        })
    }

    setGalaxyPrev(gp: GalaxyPrevI) {
        const b1 = JSON.stringify(gp.myUser) !== JSON.stringify(this.state.myUser)
        const b2 = JSON.stringify(gp.galaxy) !== JSON.stringify(this.state.galaxy)
        if (b1 || b2) {
            this.setState({
                ...this.state,
                galaxy: gp.galaxy,
                myUser: gp.myUser
            })   
        }
    }

    render(): React.ReactNode {
        const galData = this.state.galaxy
        const joined = this.state.myUser !== undefined

        return <Container fluid style={{
            background: 'linear-gradient(40deg, #ae6565, #4f4fee)',
            height: '100vh',
            position: 'fixed',
            overflow: 'auto'
        }}>
            <Row className="justify-content-center align-items-center mt-5 mb-5">
            {
                !this.props.noGalaxySpecifyed && galData ? <Card style={{
                    width: 'max-content',
                    minWidth: '300px',
                    position: 'relative'
                }} className="shadow-lg bg-dark bg-gradient text-white">
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
                                <Button variant="success">{BootIcon({ button: true }).ADD_PERSON} Invite Somone via Link</Button>
                                {
                                    joined ? (
                                        galData.props.state === 'queue' ? 
                                            <Button variant="outline-primary" onClick={() => { this.setState({...this.state, galaxy: { ...this.state.galaxy!, props: { ...this.state!.galaxy!.props, state: 'running' } }}) }}>{BootIcon({ button: true }).TRIANGLE} Run Game as Admin</Button> 
                                            : <Button variant="primary" onClick={() => SocketUser.instance.joinGame()}>→ Join running Game</Button> 
                                    ) : undefined
                                }
                            </ButtonGroup>
                        </div>

                        <Card.Text>
                            <GalaxyViewTip user={ this.state.myUser } galaxyState={ galData.props.state } galaxyName={ galData.props.name } />

                            {
                                this.state.error && this.state.error.type !== 'invalid-text' ?
                                    <GalaxyViewException message={this.state.error.message} /> : undefined
                            }
                        </Card.Text>

                        <RocketTeamList galaxy={galData} joinedTeam={this.state.myUser?.teamName} onUserJoin={team => {
                            /*this.setState({ ...this.state, myUser: {
                                id: "3",
                                name: this.nameValue,
                                galaxy: this.props.galaxy,
                                teamName: team
                            }})*/

                            SocketUser.instance.joinGalaxy(team)
                        }} />
                        
                        <Collapse in={ !joined }>
                            <InputGroup className="mb-3">
                                <InputGroup.Text className="bg-dark fs-6 text-white border-secondary" id="basic-addon1">{ BootIcon().USER_ICON }</InputGroup.Text>
                                <Form.Control
                                    placeholder="Your Nickname for the Game..."
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    className="bg-dark text-white fs-6 border-secondary"
                                    onChange={e => {
                                        this.nameValue = e.target.value as string
                                    }}
                                    isInvalid={!joined && this.state.error && this.state.error.type === 'invalid-text'}
                                />
                                {!joined && this.state.error && this.state.error.type === 'invalid-text' ? <Form.Control.Feedback type="invalid">{ this.state.error.message }</Form.Control.Feedback> : undefined }
                            </InputGroup>
                        </Collapse>
                    </Card.Body>
                </Card> : (
                    !this.props.noGalaxySpecifyed ? 
                        <Spinner animation="border" /> : <Alert variant="info" className="bg-danger px-2 py-1 bg-gradient bg-opacity-50 text-white border-0" style={{ maxWidth: '400px' }}>
                            There is no galaxy specified as URL-Parameter.
                        </Alert>
                )
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

function GalaxyViewException(p: {
    message: string | null
}) {
    return <div className='d-flex justify-content-center'>
        <Alert variant="info" className="bg-danger px-2 py-1 bg-gradient bg-opacity-50 text-white border-0" style={{ maxWidth: '400px' }}>
            { p.message ? 'Error: ' + p.message : 'Unknown Exception.' }
        </Alert>
    </div>
}

function GalaxyViewTip(p: {
    user?: UserPropsI,
    galaxyState: GalaxyStateT,
    galaxyName: string,
}) {
    return <div className='d-flex justify-content-center'>
        <Alert variant="info" className="bg-primary bg-gradient bg-opacity-50 text-white border-0" style={{ maxWidth: '400px' }}>
            { !p.user ? "Hi there, welcome to the Galaxy \"" + p.galaxyName + "\"! You can join a team by specifying your name below and then clicking on the \"Join\" button of the selected Team." : '' }
            { p.user ? "Great " + p.user.name + ", you joined the Team \"" + p.user.teamName + "\". " : '' }
            { p.user && p.galaxyState === 'queue' ? "The Game hasn't been ran yet so you have to wait until the administrator runs it." : '' }
            { p.user && p.galaxyState === 'running' ? "The Game is now running and you can join it by clicking on the button \"Join Running Game\" above." : '' }
        </Alert>
    </div>
}

function RocketTeamList(p: {
    galaxy: Galaxy2I,
    joinedTeam?: string,
    onUserJoin: (teamName: string) => void
}) {
    return <ListGroup variant="flush" className='mb-4'>
        {
            p.galaxy.teams.map(team => 
                <ListGroup.Item className={'mb-2 rounded text-white bg-' + bootTeamColor(team.props.color)}>
                    <Stack direction="horizontal" className="align-items-center" gap={3}>
                        <p className="fs-5 mb-0">{team.props.name}</p>
                        <p className="fs-7 mb-0">{team.userIds.map(id => p.galaxy.users.find(u => u.id == id)?.name).join(", ")}</p>
                        { !p.joinedTeam ? <Button variant='dark bg-gradient' className='ms-auto' onClick={() => { p.onUserJoin(team) }}>→ Join</Button>
                             : ( team.props.name === p.joinedTeam ? <div className='ms-auto bg-gradient bg-success shadow-sm rounded p-1'>{BootIcon({ button: true }).CHECK} Joined</div> : undefined )
                        }
                    </Stack>
                </ListGroup.Item>
            )
        }
    </ListGroup>
}