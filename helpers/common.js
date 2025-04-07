import { Dimensions } from "react-native";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");

export const hp = percentage => {
    return (percentage * deviceHeight) / 100;
}

export const wp = percentage => {
    return (percentage * deviceWidth) / 100;
}

export const stripHtmlTags = (html) => {
    const regex = /<[^>]*>?/gm;
    return html.replace(regex, "");
}