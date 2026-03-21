import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useSelector } from "react-redux";
import { RootState } from "../../../reduxUtils/store";
import { Svg, SvgXml } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { hScale, wScale } from "../../../utils/styles/dimensions";
import AppBar from "../headerAppbar/AppBar";
import useAxiosHook from "../../../utils/network/AxiosClient";
import { APP_URLS } from "../../../utils/network/urls";
import { translate } from "../../../utils/languageUtils/I18n";

const HelpAndSupport = () => {
  const backbutton =
    '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><linearGradient id="a" x1="219.858" x2="478.003" y1="387.123" y2="128.977" gradientTransform="matrix(1 0 0 -1 0 514.05)" gradientUnits="userSpaceOnUse"><stop stop-opacity="1" stop-color="#ff5e45" offset="0.004629617637840665"></stop><stop stop-opacity="1" stop-color="#e5596f" offset="1"></stop></linearGradient><path fill="url(#a)" d="M385.1 405.7c20 20 20 52.3 0 72.3s-52.3 20-72.3 0L126.9 292.1c-20-20-20-52.3 0-72.3L312.8 34c20-20 52.3-20 72.3 0s20 52.3 0 72.3L235.4 256z" opacity="1" data-original="url(#a)" class=""></path></g></svg>';
  const help =
    '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="110" height="110" x="0" y="0" viewBox="0 0 32 32" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><g data-name="Layer 2"><path d="M23.917 13.75v3.493a1.751 1.751 0 0 0 1.746 1.75 1.779 1.779 0 0 0 .398-.045l1.558-.36a2.737 2.737 0 0 0 2.131-2.679v-1.818a2.737 2.737 0 0 0-2.13-2.68l-1.56-.36a1.766 1.766 0 0 0-.791.002 9.406 9.406 0 0 0-18.538 0 1.76 1.76 0 0 0-.792-.001l-1.558.36A2.737 2.737 0 0 0 2.25 14.09v1.818a2.737 2.737 0 0 0 2.13 2.68l1.56.36a1.785 1.785 0 0 0 .397.045 1.751 1.751 0 0 0 1.746-1.75v-4.578a7.917 7.917 0 0 1 15.834 0zM18.5 25.5a2.253 2.253 0 0 0-2.25-2.25c-.06 0-.115.013-.173.018a.713.713 0 0 0-.2-.008 7.826 7.826 0 0 1-5.47-1.027 7.098 7.098 0 0 1-1.81-1.686.75.75 0 1 0-1.195.906 8.556 8.556 0 0 0 2.192 2.041 8.813 8.813 0 0 0 4.508 1.373A2.213 2.213 0 0 0 14 25.5a2.25 2.25 0 0 0 4.5 0z" fill="#fff" opacity="1" data-original="#000000" class=""></path><path d="M22.68 13.024a6.751 6.751 0 0 0-13.418 1.38 6.845 6.845 0 0 0 6.91 6.346H21.1a1.05 1.05 0 0 0 .63-1.89l-.617-.463a6.767 6.767 0 0 0 1.568-5.373zM13.5 14.75a.75.75 0 1 1 .75-.75.75.75 0 0 1-.75.75zm2.5 0a.75.75 0 1 1 .75-.75.75.75 0 0 1-.75.75zm2.5 0a.75.75 0 1 1 .75-.75.75.75 0 0 1-.75.75z" fill="#fff" opacity="1" data-original="#000000" class=""></path></g></g></svg>';
  const call =
    '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path fill="#c9c9c9" d="M415.737 238.933H38.404a8.534 8.534 0 0 0-8.279 6.464L.259 364.864c-1.346 5.386 2.727 10.603 8.279 10.603H126.13v11.026h249.337v-11.026h10.404a8.534 8.534 0 0 0 8.279-6.464l29.867-119.467c1.345-5.385-2.728-10.603-8.28-10.603z" opacity="1" data-original="#d83131" class=""></path><path fill="#545454" d="M415.737 238.933h-23.694c5.551 0 9.625 5.217 8.279 10.603l-29.867 119.467a8.534 8.534 0 0 1-8.278 6.464h-10.404v11.026h23.694v-11.026h10.404a8.534 8.534 0 0 0 8.279-6.464l29.867-119.467c1.345-5.385-2.728-10.603-8.28-10.603z" opacity="1" data-original="#c41926" class=""></path><g fill="#f8f6f6"><path d="M96.263 512h377.333a8.534 8.534 0 0 0 8.279-6.464l29.867-119.467c1.346-5.386-2.727-10.603-8.279-10.603H126.129a8.534 8.534 0 0 0-8.279 6.464L87.984 501.397C86.638 506.783 90.711 512 96.263 512z" fill="#343434" opacity="1" data-original="#f8f6f6" class=""></path><path d="M96.263 512h377.333a8.534 8.534 0 0 0 8.279-6.464l29.867-119.467c1.346-5.386-2.727-10.603-8.279-10.603H126.129a8.534 8.534 0 0 0-8.279 6.464L87.984 501.397C86.638 506.783 90.711 512 96.263 512zM152.598 325.779a7.726 7.726 0 0 0-10.885.953 19.76 19.76 0 0 1-1.989 2.054c-3.593 3.199-8.167 4.821-13.595 4.821-14.561 0-26.407-11.846-26.407-26.407s11.846-26.407 26.407-26.407a26.266 26.266 0 0 1 14.759 4.505 7.725 7.725 0 0 0 10.727-2.077 7.725 7.725 0 0 0-2.077-10.727c-6.927-4.68-15.022-7.153-23.409-7.153-23.081 0-41.86 18.778-41.86 41.86 0 23.081 18.778 41.86 41.86 41.86 9.201 0 17.456-3.02 23.872-8.734a35.44 35.44 0 0 0 3.55-3.661 7.73 7.73 0 0 0-.953-10.887zM217.49 271.297c-.027-.07-.054-.141-.083-.21a9.24 9.24 0 0 0-8.576-5.747h-.009a9.24 9.24 0 0 0-8.643 5.938l-25.634 67.305a7.725 7.725 0 0 0 7.218 10.478 7.73 7.73 0 0 0 7.222-4.978l4.489-11.786h30.52l4.44 11.764a7.726 7.726 0 0 0 9.957 4.501 7.726 7.726 0 0 0 4.501-9.957zm-18.131 45.548 9.445-24.798 9.358 24.798zM293.657 333.549c-5.591.031-11.598.054-16.135.057v-60.54a7.726 7.726 0 1 0-15.452 0v68.209a7.725 7.725 0 0 0 6.421 7.615c.556.096 1.008.173 8.503.173 3.644 0 8.955-.019 16.75-.062a7.727 7.727 0 0 0 7.683-7.77c-.024-4.266-3.48-7.688-7.77-7.682zM351.696 333.549c-5.591.031-11.599.054-16.135.057v-60.54a7.726 7.726 0 1 0-15.452 0v68.209a7.725 7.725 0 0 0 6.422 7.615c.556.096 1.007.173 8.5.173 3.644 0 8.956-.019 16.754-.062a7.727 7.727 0 0 0 7.683-7.77 7.723 7.723 0 0 0-7.772-7.682z" fill="#343434" opacity="1" data-original="#f8f6f6" class=""></path></g><circle cx="256" cy="119.467" r="119.467" fill="#53ba56" transform="rotate(-45 255.997 119.522)" opacity="1" data-original="#a2e62e" class=""></circle><path fill="#165418" d="M256 0c-3.998 0-7.95.2-11.847.584 60.418 5.948 107.62 56.901 107.62 118.883 0 61.981-47.202 112.934-107.62 118.882 3.897.384 7.849.584 11.847.584 65.98 0 119.467-53.487 119.467-119.466C375.467 53.487 321.98 0 256 0z" opacity="1" data-original="#32db1f" class=""></path><path fill="#343434" d="m317.072 142.871-12.068-12.068c-6.665-6.665-17.471-6.665-24.136 0-6.665 6.665-17.471 6.665-24.136 0l-12.068-12.068c-6.665-6.665-6.665-17.471 0-24.136 6.665-6.665 6.665-17.471 0-24.136l-12.068-12.068c-6.665-6.665-17.471-6.665-24.136 0l-12.068 12.068c-13.33 13.33-13.33 34.942 0 48.272l60.34 60.34c13.33 13.33 34.942 13.33 48.272 0l12.068-12.068c6.665-6.665 6.665-17.471 0-24.136z" opacity="1" data-original="#f8f6f6" class=""></path><path fill="#000000" d="m317.072 142.871-12.068-12.068c-6.665-6.665-17.471-6.665-24.136 0-6.665 6.665-17.471 6.665-24.136 0l-12.068-12.068c-6.665-6.665-6.665-17.471 0-24.136s6.665-17.471 0-24.136l-12.068-12.068c-6.665-6.665-17.471-6.665-24.136 0l-3.784 3.784c4.662-.244 9.405 1.395 12.966 4.956l12.068 12.068c6.665 6.665 6.665 17.471 0 24.136s-6.665 17.471 0 24.136l12.068 12.068c6.665 6.665 17.471 6.665 24.136 0s17.471-6.665 24.136 0l3.328 3.328c6.665 6.665 6.665 17.471 0 24.136l-12.068 12.068a33.985 33.985 0 0 1-12.289 7.874c12.113 4.474 26.253 1.855 35.983-7.874l12.068-12.068c6.665-6.665 6.665-17.471 0-24.136zM503.462 375.467h-23.694c5.552 0 9.625 5.217 8.279 10.603L458.18 505.536a8.534 8.534 0 0 1-8.279 6.464h23.694a8.534 8.534 0 0 0 8.279-6.464l29.867-119.467c1.346-5.385-2.727-10.602-8.279-10.602z" opacity="1" data-original="#e2e2e2" class=""></path><g fill="#d83131"><path d="M208.169 401.874h-.076a7.726 7.726 0 0 0-7.651 7.801l.428 44.235-33.543-48.573a7.727 7.727 0 0 0-14.084 4.39v68.139a7.726 7.726 0 1 0 15.452 0v-43.354l31.989 46.322c2.302 3.327 6.129 4.747 9.751 3.614 3.703-1.157 6.096-4.643 6.096-8.958l-.638-65.966a7.724 7.724 0 0 0-7.724-7.65zM420.806 402.147a7.727 7.727 0 0 0-9.086 6.07l-8.533 42.877-13.484-43.769a7.727 7.727 0 0 0-14.952.722L361.424 451.1l-8.506-43a7.726 7.726 0 0 0-15.159 2.999l13.301 67.241c.073.369.173.732.299 1.086a9.274 9.274 0 0 0 8.732 6.166l.062-.001a9.273 9.273 0 0 0 8.778-6.486l13.389-43.257 13.329 43.267a9.274 9.274 0 0 0 8.835 6.477l.062-.001a9.273 9.273 0 0 0 8.712-6.283c.109-.32.197-.648.263-.98l13.354-67.097a7.725 7.725 0 0 0-6.069-9.084zM277.072 401.874c-23.081 0-41.86 18.778-41.86 41.86 0 23.081 18.778 41.86 41.86 41.86s41.86-18.778 41.86-41.86-18.778-41.86-41.86-41.86zm0 68.266c-14.561 0-26.407-11.846-26.407-26.407s11.846-26.407 26.407-26.407 26.407 11.846 26.407 26.407-11.846 26.407-26.407 26.407z" fill="#c9c9c9" opacity="1" data-original="#d83131" class=""></path></g></g></svg>';
  const sendmail =
    '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" x="0" y="0" viewBox="0 0 23959 24750" style="enable-background:new 0 0 512 512" xml:space="preserve" fill-rule="evenodd" class=""><g transform="matrix(1,2.4492935982947064e-16,-2.4492935982947064e-16,1,3.637978807091713e-12,-3.637978807091713e-12)"><path fill="#c4ceda" d="m19494 16721 2237-1115c330-164 703-122 989 112 286 233 400 591 304 948l-2001 7404c-75 278-255 487-520 602-265 114-540 104-794-32l-1887-1001-685 698c-226 230-528 321-844 255-315-67-555-273-668-575l-583-1554-2193-661c-367-111-616-418-648-800-33-382 161-727 504-898l5980-2980c-125-6-249-38-369-98l-5028-2505-3416 4025c-240 283-602 391-958 287-355-105-601-392-649-760l-920-6997-5844-1166c-412-82-707-418-735-837s219-791 616-928l2076-714L22681 816c332-114 675-39 929 202l64 60c195 185 292 419 285 688-5 219-78 411-216 570l-3817 13056c0 2-1 4-1 6l-312 1064c-28 95-67 182-119 259z" opacity="1" data-original="#c4ceda" class=""></path><path fill="#ffffff" d="m18731 15957 2236-1114c330-165 704-123 989 111 286 234 401 592 304 948l-2001 7404c-75 279-255 487-520 602-264 115-540 104-794-31l-1886-1002-685 698c-226 230-529 322-844 255-316-67-555-273-669-575l-582-1553-2193-662c-367-111-616-418-649-800-32-382 161-727 505-898l5980-2980c-125-5-250-38-370-98l-5028-2505-3416 4026c-240 282-602 391-958 286-355-105-601-392-649-760l-920-6997L737 9147c-411-82-707-418-735-837s219-792 616-929l2077-714L21917 52c332-114 675-39 929 202l64 61c195 185 292 418 285 687-5 219-78 412-216 570l-3817 13056c0 2-1 4-1 6l-312 1065c-27 95-67 181-118 258z" opacity="1" data-original="#ffffff" class=""></path><path fill="#01c5ff" d="m12350 20161 9026-4498-2001 7404-2491-1322-1165 1186-741-1978z" opacity="1" data-original="#f2384e" class=""></path><path fill="#ecf0f1" d="M22216 919 917 8248l6487 1294z" opacity="1" data-original="#ecf0f1" class=""></path><path fill="#4d4d4d" d="m917 8248 6487 1294 4306-2507-8717 499z" opacity="1" data-original="#53b4ed" class=""></path><path fill="#c6cbd6" d="m7404 9542 1005 7648L22216 919z" opacity="1" data-original="#c6cbd6"></path><path fill="#6b6b6b" d="m7404 9542 1005 7648 6171-7272-1065-1736-2110 1762 305-2909z" opacity="1" data-original="#2a68a6" class=""></path><path fill="#ecf0f1" d="M22216 919 9734 11338l-1325 5852z" opacity="1" data-original="#ecf0f1" class=""></path><path fill="#161616" d="m11405 9944-1671 1394-1325 5852 6171-7272-1065-1736z" opacity="1" data-original="#225991" class=""></path><path fill="#ecf0f1" d="M17970 15442 22216 919 9734 11338z" opacity="1" data-original="#ecf0f1" class=""></path><path fill="#4d4d4d" d="m9725 11338 8236 4104 322-1071-4174-6685z" opacity="1" data-original="#53b4ed" class=""></path><path fill="#434343" d="m9725 11338 280 140 4230-3590-126-202z" opacity="1" data-original="#74c3f1" class=""></path><path fill="#ffffff" d="m22216 919-350 120-10559 6019 403-23z" opacity="1" data-original="#ffffff" class=""></path><path fill="#434343" d="M11307 7058 6925 9447l479 95 4306-2507z" opacity="1" data-original="#74c3f1" class=""></path><path fill="#ffffff" d="m22279 979-63-60-8107 6767 126 202z" opacity="1" data-original="#ffffff" class=""></path></g></svg>';
  const chat =
    '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="50" height="50" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path d="M469.333 8.531H196.267c-23.526 0-42.667 19.14-42.667 42.667v170.667c0 23.526 19.14 42.667 42.667 42.667h133.444l100.027 83.356c5.459 4.55 13.996.514 13.996-6.556v-76.8h25.6c23.526 0 42.667-19.14 42.667-42.667V51.198C512 27.671 492.86 8.531 469.333 8.531z" style="" fill="#4c5251" data-original="#74dbc9" opacity="1" class=""></path><path d="M179.2 221.865V51.198c0-23.526 19.14-42.667 42.667-42.667h-25.6c-23.526 0-42.667 19.14-42.667 42.667v170.667c0 23.526 19.14 42.667 42.667 42.667h25.6c-23.527-.001-42.667-19.14-42.667-42.667zM355.311 264.531h-25.6l100.027 83.356c5.459 4.55 13.996.514 13.996-6.556v-3.115l-88.423-73.685z" style="" fill="#303635" data-original="#6ac8b7" class="" opacity="1"></path><path d="M435.2 85.331h-76.8a8.533 8.533 0 0 1 0-17.066h76.8a8.533 8.533 0 0 1 0 17.066zM366.933 153.598H230.4a8.533 8.533 0 0 1 0-17.066h136.533a8.533 8.533 0 0 1 0 17.066zM401.067 221.865H230.4a8.533 8.533 0 0 1 0-17.066h170.667a8.533 8.533 0 0 1 0 17.066zM435.2 153.598h-42.667a8.533 8.533 0 0 1 0-17.066H435.2a8.533 8.533 0 0 1 0 17.066z" style="" fill="#ffffff" data-original="#ffffff"></path><path d="M315.733 68.265H42.667C19.14 68.265 0 87.405 0 110.931v170.667c0 23.526 19.14 42.667 42.667 42.667h17.067v76.8c0 7.07 8.537 11.105 13.997 6.556l100.027-83.356h141.977c23.526 0 42.667-19.14 42.667-42.667V110.931c-.002-23.526-19.142-42.666-42.669-42.666z" style="" fill="#ff9400" data-original="#c3c4c6" class="" opacity="1"></path><path d="M85.333 324.265H68.267c-23.526 0-42.667-19.14-42.667-42.667V110.931c0-23.526 19.14-42.667 42.667-42.667h-25.6C19.14 68.264 0 87.405 0 110.931v170.667c0 23.526 19.14 42.667 42.667 42.667h17.067v76.8c0 7.07 8.537 11.105 13.997 6.556l11.603-9.669v-73.687z" style="" fill="#d38213" data-original="#afb0b4" class="" opacity="1"></path><circle cx="102.4" cy="196.267" r="25.6" style="" fill="#ffffff" data-original="#ffffff"></circle><circle cx="179.2" cy="196.267" r="25.6" style="" fill="#ffffff" data-original="#ffffff"></circle><circle cx="256" cy="196.267" r="25.6" style="" fill="#ffffff" data-original="#ffffff"></circle><path d="M183.467 477.869h-46.933v-72.533c0-7.069-5.731-12.8-12.8-12.8-7.069 0-12.8 5.731-12.8 12.8v85.333c0 7.069 5.731 12.8 12.8 12.8h59.733c7.069 0 12.8-5.731 12.8-12.8s-5.732-12.8-12.8-12.8zM230.4 392.535c-7.069 0-12.8 5.731-12.8 12.8v85.333c0 7.069 5.731 12.8 12.8 12.8s12.8-5.731 12.8-12.8v-85.333c0-7.069-5.731-12.8-12.8-12.8zM354.621 393.451c-6.566-2.625-14.013.567-16.639 7.131l-22.249 55.622-22.249-55.622c-1.967-4.916-6.915-8.178-12.209-8.044-5.355.135-10.165 3.722-11.837 8.806a12.852 12.852 0 0 0 .278 8.746l34.133 85.333c1.923 4.809 6.706 8.046 11.885 8.046s9.962-3.238 11.885-8.046l34.133-85.333c2.626-6.565-.568-14.014-7.131-16.639zM448 477.869h-38.4v-17.067h21.333c7.069 0 12.8-5.731 12.8-12.8s-5.731-12.8-12.8-12.8H409.6v-17.067H448c7.069 0 12.8-5.731 12.8-12.8s-5.731-12.8-12.8-12.8h-51.2c-7.069 0-12.8 5.731-12.8 12.8v85.333c0 7.069 5.731 12.8 12.8 12.8H448c7.069 0 12.8-5.731 12.8-12.8s-5.731-12.799-12.8-12.799z" style="" fill="#5c5c5c" data-original="#f07b52" class="" opacity="1"></path></g></svg>';
  const nextarrow =
    '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="40" height="40" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g><path d="M149.3 481c-3 0-6-1.1-8.2-3.4-4.6-4.6-4.6-11.9 0-16.5L346.2 256 141.1 50.9c-4.6-4.6-4.6-11.9 0-16.5s11.9-4.6 16.5 0l213.3 213.3c4.6 4.6 4.6 11.9 0 16.5L157.6 477.6c-2.3 2.3-5.3 3.4-8.3 3.4z" fill="#000000" opacity="1" data-original="#000000" class=""></path></g></svg>';

  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const navigation = useNavigation();
  const color1 = `${colorConfig.primaryColor}10`;
  const color2 = `${colorConfig.secondaryColor}10`;

  const [supportData, setSuppportData] = useState([]);
  const { get } = useAxiosHook();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await get({ url: APP_URLS.Support_Information });
        setSuppportData(response);
        console.log(response);
      } catch (error) {}
    };

    getData();
  }, []);

  const handlebackpress = () => {
    navigation.goBack();
  };

  const phoneNumber = "7073056391"; // Replace this with the phone number you want to call

  const openPhoneApp = () => {
    Linking.openURL(`tel:${supportData.adminmobile}`);
  };
  const gmail = supportData.adminemail;
  const opengmailURL = () => {
    const email = gmail;
    const subject = "To Subject";
    const emailbody = "Test Body";
    const mailTo = `mailto:${email}?subject=${subject}&body=${emailbody}`;

    Linking.openURL(mailTo)
      .then(() => console.log("Email app open successfully"))
      .then((err) => console.error("Faild to open email : ", err));
  };

  const bankholiday = () => {
    navigation.navigate("Bankholidays");
  };
  const faqspress = () => {
    navigation.navigate("FAQs");
  };
  const Complaint = () => {
    navigation.navigate("Complaint");
  };

  return (
    <View style={styles.main}>
      <LinearGradient
        style={styles.LinearGradient}
        colors={[colorConfig.primaryColor, colorConfig.secondaryColor]}
      >
        <View>
          <AppBar title={"Help & Support"} />

          <View style={[styles.supporthelp, {}]}>
            <View
              style={[
                styles.topcontainer,
                {
                  backgroundColor: colorConfig.secondaryColor,
                },
              ]}
            >
              <Text style={styles.supporttimestyle}>
                {translate("Our Customer Care Timing")}
              </Text>

              <View style={styles.topitem}>
                <View style={styles.helpimgstyle}>
                  <SvgXml xml={help} />
                </View>

                <View style={styles.topright}>
                  <Text allowFontScaling={false} style={styles.timestyle}>
                    {translate("Cust Time")}
                  </Text>
                  <View style={styles.mondaytofriday}>
                    <Text allowFontScaling={false} style={styles.dayTimeStyle}>
                      {translate("Monday to Friday")}
                    </Text>
                    <Text allowFontScaling={false} style={styles.dayTimeStyle}>{translate("1030_AM_0740_PM")}</Text>
                  </View>
                  <View style={styles.everysaturday}>
                    <Text allowFontScaling={false} style={styles.dayTimeStyle}>
                      {translate("Every Saturday")}
                    </Text>
                    <Text allowFontScaling={false} style={styles.dayTimeStyle}>
                      {translate("Every Sunday")}
                    </Text>
                  </View>
                  <View style={styles.everysaturday}>
                    <Text
                      allowFontScaling={false}
                      style={styles.saturdaySundayTim}
                    >{translate("1000_AM_0200_PM")}</Text>
                    <Text
                      allowFontScaling={false}
                      style={styles.saturdaySundayTim}
                    >{translate("1000_AM_0200_PM")}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        <ScrollView>
          <View style={styles.bodyStyle}>
            <View style={styles.bodyopcitystyle}>
              <View style={styles.bodybackgroundstyle}>
                <View style={styles.fixmatgintopbottom}>
                  <View style={styles.customernumber}>
                    <View style={styles.holidaymaintextstyle}>
                      <Text
                        allowFontScaling={false}
                        style={styles.ourCustomerheader}
                      >
                        {translate("Customer Care Number")}
                      </Text>
                      <TouchableOpacity
                        onPress={openPhoneApp}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.countrynumber}>
                          +91 {supportData.adminmobile}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      onPress={openPhoneApp}
                      activeOpacity={0.7}
                      style={[
                        styles.imgborder,
                        {
                          borderLeftColor: colorConfig.primaryColor,
                          borderRightColor: colorConfig.secondaryColor,
                          borderTopColor: colorConfig.primaryColor,
                          borderBottomColor: colorConfig.secondaryColor,
                        },
                      ]}
                    >
                      <View style={styles.callimg}>
                        <SvgXml xml={call} />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.bodybackgroundstyle}>
                <View style={styles.fixmatgintopbottom}>
                  <View style={styles.customernumber}>
                    <View style={styles.holidaymaintextstyle}>
                      <Text style={styles.ourCustomerheader}>
                        {translate("Support Email-ID")}
                      </Text>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={opengmailURL}
                      >
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={styles.mailStyle}
                        >
                          {supportData.adminemail}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View>
                      <TouchableOpacity
                        onPress={opengmailURL}
                        activeOpacity={0.7}
                        style={[
                          styles.imgborder,
                          {
                            borderLeftColor: colorConfig.primaryColor,
                            borderRightColor: colorConfig.secondaryColor,
                            borderTopColor: colorConfig.primaryColor,
                            borderBottomColor: colorConfig.secondaryColor,
                          },
                        ]}
                      >
                        <View style={styles.callimg}>
                          <SvgXml xml={sendmail} />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.bodybackgroundstyle}>
                <View style={styles.fixmatgintopbottom1}>
                  <View style={styles.customernumber}>
                    <View style={styles.holidaymaintextstyle}>
                      <Text style={styles.ourCustomerheader}>
                        {translate("Complaint Through Chat Service")}
                      </Text>

                      <Text
                        numberOfLines={4}
                        ellipsizeMode="tail"
                        style={styles.holidayText}
                      >
                        {translate("Complaint")}
                      </Text>
                    </View>
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          Complaint();
                        }}
                        activeOpacity={0.7}
                        style={[
                          styles.imgborder,
                          {
                            borderLeftColor: colorConfig.primaryColor,
                            borderRightColor: colorConfig.secondaryColor,
                            borderTopColor: colorConfig.primaryColor,
                            borderBottomColor: colorConfig.secondaryColor,
                          },
                        ]}
                      >
                        <View style={styles.callimg}>
                          <SvgXml xml={chat} />
                        </View>

                        {/* </LinearGradient> */}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.bodybackgroundstyle1}>
                <View style={styles.bankholiday}>
                  <TouchableOpacity activeOpacity={0.7} onPress={bankholiday}>
                    <Text
                      allowFontScaling={false}
                      style={styles.ourCustomerheader}
                    >
                      {translate("Coming Bank Holidays")}
                    </Text>

                    <View style={styles.bankholidayflex}>
                      <View style={styles.holidaymaintextstyle}>
                        <Text
                          numberOfLines={4}
                          ellipsizeMode="tail"
                          style={styles.holidayText}
                        >
                          {translate("Bank Holiday")}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={bankholiday}>
                        <SvgXml xml={nextarrow} style={styles.nextimg} />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.bodybackgroundstyle2}>
                <View style={styles.bankholiday}>
                  <TouchableOpacity activeOpacity={0.7} onPress={faqspress}>
                    <Text
                      allowFontScaling={false}
                      style={styles.ourCustomerheader}
                    >
                      {translate("FAQs")}
                    </Text>

                    <View style={styles.bankholidayflex}>
                      <View style={styles.holidaymaintextstyle}>
                        <Text
                          numberOfLines={4}
                          ellipsizeMode="tail"
                          style={styles.holidayText}
                        >
                          {translate("FAQ description")}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={faqspress}>
                        <SvgXml xml={nextarrow} style={styles.nextimg} />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    width: "100%",
    height: "100%",
  },
  LinearGradient: {
    height: "100%",
    width: "100%",
  },
  helpimgstyle: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: hScale(5),
  },
  topitem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: wScale(12),
    paddingLeft: wScale(5),
    marginTop: hScale(-13),
  },
  topright: { flex: 1, marginLeft: wScale(5) },
  topcontainer: {
    width: "100%",
    borderRadius: 5,
  },

  backbuttonstyle: {
    width: "10%",
    justifyContent: "center",
    alignItems: "center",
  },

  supporttimestyle: {
    fontSize: wScale(31),
    fontWeight: "bold",
    color: "#fff",
    alignSelf: "center",
  },
  callimg: { padding: wScale(6) },
  timestyle: {
    color: "#fff",
    textAlign: "justify",
    fontSize: wScale(9.5),
    borderBottomColor: "#fff",
    borderBottomWidth: hScale(0.4),
    paddingBottom: hScale(3),
  },
  dayTimeStyle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: wScale(13),
  },
  mondaytofriday: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: hScale(3),
    borderBottomColor: "#fff",
    borderBottomWidth: hScale(0.4),
  },
  everysaturday: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saturdaySundayTim: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: wScale(12),
  },
  bodyStyle: {
    width: "100%",
    height: "100%",
  },

  bodyopcitystyle: {
    marginHorizontal: wScale(10),
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    marginBottom: wScale(10),
    paddingTop: wScale(10),
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },

  bodybackgroundstyle: {
    backgroundColor: "#fff",
    marginLeft: wScale(10),
    marginRight: wScale(10),
    marginBottom: wScale(10),
    borderRadius: 5,
    // borderBottomLeftRadius: 5,
    // borderBottomRightRadius: 5,
    paddingTop: wScale(10),
  },
  bodybackgroundstyle1: {
    backgroundColor: "#fff",
    marginLeft: wScale(10),
    marginRight: wScale(10),
    marginBottom: wScale(10),
    borderRadius: 5,
    // paddingTop: 0,
    paddingVertical: hScale(5),
  },
  bodybackgroundstyle2: {
    backgroundColor: "#fff",
    marginLeft: wScale(10),
    marginRight: wScale(10),
    marginBottom: wScale(10),
    borderRadius: 5,
    // paddingTop: 0,
    paddingVertical: hScale(5),
  },

  supporthelp: {
    marginLeft: wScale(10),
    marginRight: wScale(10),
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    alignItems: "center",
  },
  customernumber: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonStyle: {
    borderWidth: wScale(1),
    padding: wScale(5),
    borderRadius: 2,
    width: wScale(100),
    height: hScale(30),
    justifyContent: "center",
    alignItems: "center",
  },
  borderStyle: {
    elevation: 1,
    borderColor: "#000",
    borderBottomWidth: wScale(0.5),
    marginVertical: hScale(10),
  },
  bankholiday: {
    marginHorizontal: wScale(10),
    marginBottom: hScale(5),
  },
  bankholidayflex: {
    flexDirection: "row",
    justifyContent: "space-between",

    alignItems: "center",
  },
  holidaymaintextstyle: {
    width: wScale(280),
    // backgroundColor: 'red'
  },

  holidayText: {
    color: "#000",
    textAlign: "justify",
    fontSize: wScale(10),
    marginTop: hScale(5),
  },
  nextimg: {
    marginRight: wScale(-8.4),
  },
  ourCustomerheader: {
    color: "#000",
    fontSize: wScale(16),
    fontWeight: "bold",
  },
  imgborder: {
    borderWidth: wScale(0.7),
    borderRadius: wScale(5),
  },
  countrynumber: {
    color: "#000",
    fontSize: wScale(27),
    marginTop: wScale(8),
  },
  mailStyle: {
    color: "#000",
    fontSize: wScale(21),
    marginTop: wScale(8),
  },
  fixmatgintopbottom: {
    marginHorizontal: wScale(10),
    paddingBottom: hScale(10),
  },
  fixmatgintopbottom1: {
    marginHorizontal: wScale(10),
    paddingBottom: hScale(3),
  },
});

export default HelpAndSupport;
