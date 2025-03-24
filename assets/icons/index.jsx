import React from 'react'
import { theme } from '../../constants/theme'
import Home from './home'
import Mail from './Mail'
import Lock from './Lock'
import User from './User'
import Heart from './Heart'
import Plus from './Plus'
import Search from './Search'
import Camera from './Camera'
import Location from './Location'
import Call from './Call'
import Edit from './Edit'
import ArrowLeft from './ArrowLeft'
import ThreeDotsCircle from './ThreeDotsCircle'
import ThreeDotsHorizontal from './ThreeDotsHorizontal'
import Comment from './Comment'
import Share from './Share'
import Send from './Send'
import Delete from './Delete'
import Logout from './logout'
import Image from './Image'
import Video from './Video'

const icons = {
    home: Home,
    mail: Mail,
    lock: Lock,
    user: User,
    heart: Heart,
    plus: Plus,
    search: Search,
    camera: Camera,
    location: Location,
    call: Call,
    edit: Edit,
    arrowLeft: ArrowLeft,
    threeDotsCircle: ThreeDotsCircle,
    threeDotsHorizontal: ThreeDotsHorizontal,
    comment: Comment,
    share: Share,
    send: Send,
    delete: Delete,
    logout: Logout,
    image: Image,
    video: Video
}

const Icon = ({name, ...props}) => {
    const IconComponent = icons[name];
    return (
        <IconComponent 
            size = {props.size || 24}
            color = {theme.colors.textLight}
            {...props} />
    )
}

export default Icon;
