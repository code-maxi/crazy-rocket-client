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
import { BootIcon } from '../../gui-adds'

import React from "react";
import { GalaxyI, GalaxyPrevI, GalaxyStateT, ResponseResultI, TeamColorT, UserPropsI } from "../../common/declarations"
import { SocketUser } from "../network/socket-user"
import { ButtonGroup, Collapse, OverlayTrigger, Tooltip } from 'react-bootstrap'

const copy = require('clipboard-copy')

export interface GalaxyLoginStateI {
    galaxy?: GalaxyI,
    error?: {
        message: string | null,
        type: string
    },
    myUser?: UserPropsI,
    passwordFieldOpen: boolean,
    passwordValue: string,
    nameValue: string,
    clipboardTooltip: boolean
}

export interface GalaxyLoginPropsI {
    noGalaxySpecifyed: boolean,
    name: string | null,
    autoJoinTeam: string | null
}

export class GalaxyLogin extends React.Component<GalaxyLoginPropsI, GalaxyLoginStateI> {
    static instance: GalaxyLogin
    
    constructor(p: any) {
        super(p)
        //this.nameValue = this.props.name ? this.props.name : ''
        this.state = {
            error: this.props.noGalaxySpecifyed ? {
                message: "There is no galaxy specified as URL-Parameter.",
                type: "no-galaxy-specified"
            } : undefined,
            passwordFieldOpen: false,
            passwordValue: '',
            nameValue: this.props.name ? this.props.name : '',
            clipboardTooltip: false
        }
        GalaxyLogin.instance = this
    }

    setGalaxyPrev(gp: GalaxyPrevI) {
        const b1 = JSON.stringify(gp.myUser) !== JSON.stringify(this.state.myUser)
        const b2 = JSON.stringify(gp.galaxy) !== JSON.stringify(this.state.galaxy)
        if (b1 || b2) {
            console.log("changing state to galaxy data")
            console.log()
            this.setState({
                ...this.state,
                galaxy: gp.galaxy,
                myUser: gp.myUser
            })
        }
    }

    setErrorResult(res: ResponseResultI) {
        if (!res.successfully) {
            this.setState({
                ...this.state,
                error: {
                    message: res.message,
                    type: res.errorType ? res.errorType : 'unknown-type'
                }
            })
        } else {
            let newState = {
                ...this.state,
                error: undefined
            }

            if (res.header === 'start-game-result') newState = {
                ...newState,
                passwordFieldOpen: false,
                passwordValue: ''
            }

            this.setState(newState)
        }
    }

    joinGalaxy(teamcolor: string) {
        console.log('trying to join teamcolor ' + teamcolor)
        SocketUser.instance.joinGalaxy('"' + this.state.nameValue + '"', teamcolor)
    }

    onSocketInit() {
        if (this.props.autoJoinTeam) { this.joinGalaxy(this.props.autoJoinTeam) }
    }

    private endRunGamePassword(runGame: boolean) {
        if (runGame) {
            SocketUser.instance.runGame(this.state.passwordValue)
        }
        else this.setState({
            ...this.state,
            passwordFieldOpen: false
        })
    }

    private copyLink() {
        copy(window.location.href)
        this.setState({
            ...this.state,
            clipboardTooltip: true
        })
        setTimeout(() => {
            this.setState({
                ...this.state,
                clipboardTooltip: false
            })  
        }, 3000)
    }

    render(): React.ReactNode {
        const galData = this.state.galaxy
        const joined = this.state.myUser?.galaxy !== undefined
        const topErrorTypes = [ 'invalid-password' ]

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
                                <OverlayTrigger
                                    key="bottom"
                                    placement="bottom"
                                    show={this.state.clipboardTooltip}
                                    overlay={
                                        <Tooltip>
                                            Copied to Clipboard!
                                        </Tooltip>
                                    }
                                >
                                    <Button variant="success" onClick={ () => this.copyLink() }>{BootIcon({ button: true }).ADD_PERSON} Invite Somone via Link</Button>
                                </OverlayTrigger>
                                {
                                    joined ? (
                                        galData.props.state === 'queue' ? 
                                            <Button 
                                                variant="primary" 
                                                onClick={() => {
                                                    //this.setState({...this.state, galaxy: { ...this.state.galaxy!, props: { ...this.state!.galaxy!.props, state: 'running' } }}) 
                                                    //SocketUser.instance.runGame('lalala')
                                                    this.setState({
                                                        ...this.state,
                                                        passwordFieldOpen: true,
                                                        passwordValue: ''
                                                    })
                                                }}
                                            > {BootIcon({ button: true }).TRIANGLE} Run Game as Admin
                                            </Button> :
                                            <Button 
                                                variant="primary" 
                                                onClick={() => SocketUser.instance.joinGame()}
                                            >→ Join running Game
                                            </Button> 
                                    ) : undefined
                                }
                            </ButtonGroup>
                        </div>

                        <Collapse in={ this.state.passwordFieldOpen }>
                            <InputGroup className="mb-3" style={{ maxWidth: '400px' }}>
                                <Button variant="outline-danger" onClick={() => this.endRunGamePassword(false)}>Cancel</Button>
                                <Form.Control
                                    type="password"
                                    className="bg-dark text-white border-secondary"
                                    placeholder="password of the galaxy"
                                    value={ this.state.passwordValue }
                                    onChange={ e => this.setState({
                                        ...this.state,
                                        passwordValue: e.target.value
                                    }) }
                                    aria-describedby="passwordHelpBlock"
                                />
                                <Button variant="outline-success" onClick={() => this.endRunGamePassword(true)}>Run Game</Button>
                            </InputGroup>
                        </Collapse>

                        <GalaxyViewException error={this.state.error} includeErrorTypes={ topErrorTypes } />

                        <Card.Text>
                            <GalaxyViewTip user={ joined ? this.state.myUser : undefined } galaxyState={ galData.props.state } galaxyName={ galData.props.name } />
                        </Card.Text>

                        <RocketTeamList 
                            galaxy={galData} 
                            joinedTeam={this.state.myUser?.teamColor} 
                            onUserJoin={teamcolor => {
                            /*this.setState({ ...this.state, myUser: {
                                id: "3",
                                name: this.nameValue,
                                galaxy: this.state.galaxy,
                                teamName: team
                            }})*/
                                this.joinGalaxy(teamcolor)
                            }}
                        />

                        <GalaxyViewException error={this.state.error} excludeErrorTypes={ topErrorTypes } />
                        
                        <Collapse in={ !joined }>
                            <InputGroup className="mb-3" style={{ maxWidth: '400px' }}>
                                <InputGroup.Text className="bg-dark fs-6 text-white border-secondary" id="basic-addon1">{ BootIcon().USER_ICON }</InputGroup.Text>
                                <Form.Control
                                    placeholder="Your Nickname for the Game..."
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    className="bg-dark text-white fs-6 border-secondary"
                                    value={this.state.nameValue}
                                    onChange={e => {
                                        this.setState({
                                            ...this.state,
                                            nameValue: e.target.value as string
                                        })
                                    }}
                                    isInvalid={!joined && this.state.error && this.state.error.type === 'invalid-text'}
                                />
                                {
                                    /*!joined && this.state.error && this.state.error.type === 'invalid-text' ? 
                                        <Form.Control.Feedback 
                                            type="invalid"
                                        >{ this.state.error.message }</Form.Control.Feedback> : undefined
                                    */
                                   undefined
                                }
                            </InputGroup>
                        </Collapse>
                    </Card.Body>
                </Card> : (
                    !this.state.error ? 
                        <Spinner animation="border" /> : <Alert variant="info" className="bg-danger px-2 py-1 bg-gradient bg-opacity-50 text-white border-0" style={{ maxWidth: '400px' }}>
                            Error: {this.state.error.message}
                        </Alert>
                )
            }
            </Row>
        </Container>
    }
}

export function bootTeamColor(c: TeamColorT) {
    var res: string | undefined = undefined
    if (c === 'blue') res = 'primary'
    if (c === 'red') res = 'danger'
    if (c === 'green') res = 'success'
    if (c === 'yellow') res = 'warning'
    return res!
}

function GalaxyViewException(p: {
    error?: {
        message: string | null,
        type: string
    },
    includeErrorTypes?: string[],
    excludeErrorTypes?: string[]
}) {
    return <React.Fragment>
        {
            p.error && (!p.includeErrorTypes || p.includeErrorTypes.includes(p.error.type)) && (!p.excludeErrorTypes || !p.excludeErrorTypes.includes(p.error.type)) ? (
                <div className='d-flex justify-content-center'>
                    <Alert variant="info" className="bg-danger px-3 py-2 bg-gradient bg-opacity-25 text-white border-0" style={{ maxWidth: '400px' }}>
                        <div className="fw-bold">An error has occurred!</div>
                        <div className="lh-sm pb-1">{ p.error.message ? p.error.message : 'Unknown Exception.' }</div>
                    </Alert>
                </div>
            ) : undefined
        }
    </React.Fragment>
}

function GalaxyViewTip(p: {
    user?: UserPropsI,
    galaxyState: GalaxyStateT,
    galaxyName: string,
}) {
    return <div className='d-flex justify-content-center'>
        <Alert variant="info" className="bg-primary bg-gradient bg-opacity-50 text-white border-0" style={{ maxWidth: '400px' }}>
            { !p.user ? "Hi there, welcome to the Galaxy \"" + p.galaxyName + "\"! You can join a team by specifying your name below and then clicking on the \"Join\" button of the selected Team." : '' }
            { p.user ? "Great " + p.user.name + ", you joined the Team \"" + p.user.teamColor?.toUpperCase() + "\". " : '' }
            { p.user && p.galaxyState === 'queue' ? "The Game hasn't been ran yet so you have to wait until the administrator runs it." : '' }
            { p.user && p.galaxyState === 'running' ? "The Game is now running and you can join it by clicking on the button \"Join Running Game\" above." : '' }
        </Alert>
    </div>
}

function RocketTeamList(p: {
    galaxy: GalaxyI,
    joinedTeam?: string | null,
    onUserJoin: (teamName: string) => void
}) {
    return <ListGroup variant="flush" className='mb-4'>
        {
            p.galaxy.teams.map(team => 
                <ListGroup.Item className={'mb-2 rounded text-white bg-' + bootTeamColor(team.props.color)}>
                    <Stack direction="horizontal" className="align-items-center" gap={3}>
                        <p className="fs-5 mb-0">Team {team.props.name}</p>
                        <p className="fs-7 mb-0">
                            { team.userIds.length > 0 ? 
                                'Users: ' + team.userIds.map(id => p.galaxy.users.find(u => u.id == id)?.name).join(", ")
                                : 'no users yet'
                            }
                        </p>
                        { !p.joinedTeam ? 
                            <Button 
                                variant='dark bg-gradient' 
                                className='ms-auto' 
                                onClick={() => { p.onUserJoin(team.props.color) }}
                            >→ Join</Button>
                            : (
                                team.props.color === p.joinedTeam ? 
                                    <div className='ms-auto bg-gradient bg-success shadow-sm rounded p-1'>
                                        {BootIcon({ button: true }).CHECK} Joined
                                    </div> : undefined
                            )
                        }
                    </Stack>
                </ListGroup.Item>
            )
        }
    </ListGroup>
}


/*const exampleGalaxyViewState: GalaxyLoginStateI = {
    galaxy: {
        props: {
            name: 'test-galaxy',
            state: "queue"
        },
        users: [
            {
                id: "1",
                name: "User 1",
                galaxy: 'test-galaxy',
                teamColor: null
            },
            {
                id: "2",
                name: "User 2",
                galaxy: 'test-galaxy',
                teamColor: null
            },
            {
                id: "3",
                name: "User 3",
                galaxy: 'test-galaxy',
                teamColor: null
            }
        ],
        teams: [
            {
                props: {
                    galaxyName: 'test-galaxy',
                    name: "Team Rot",
                    color: "red"
                },
                userIds: ["1"]
            },
            {
                props: {
                    galaxyName: 'test-galaxy',
                    name: "Team Blau",
                    color: "blue"
                },
                userIds: ["2"]
            },
            {
                props: {
                    galaxyName: 'test-galaxy',
                    name: "Team Grün",
                    color: "green"
                },
                userIds: ["3"]
            }
        ]
    },
    error: {
        type: 'inlid-text',
        message: 'Der Name ist zu kurz.'
    }
}*/