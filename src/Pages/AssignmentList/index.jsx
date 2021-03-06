import React, { useEffect, useState, useRef, memo } from "react";
import { observer, inject } from "mobx-react";

import MainLayout from "@templates/MainLayout";
import Table from "@components/Table";
import Language from "@components/Language";
import FloatingMenu from "@components/FloatingMenu";

import * as Util from "@util";
import "./style.scss";

const AssignmentListPage = (props) => {
    const { storeMain, storeLecture, storeTask } = props;
    const [list, setList] = useState([]);
    let headerItem = [];
    let childElement = null;
    let createBtnElem = null;

    useEffect(() => {
        Util.requestServer("task/list", "GET", {
            courseIdx: storeLecture.selectLecture.courseIdx,
        }).then(function (result) {
            console.log(result);
            if (result.code === 200) {
                setList(result.body.list);
            }
        });
    }, []);

    const handleTask = (item) => {
        storeTask.selectTaskItem(item);
        props.history.push("/editor/" + item.taskIdx);
    };

    const handleFloating = (e) => {
        props.history.push("/editor");
    };

    if (storeMain.userType === 0) {
        headerItem = [
            {
                text: "과제 명",
                align: "left",
                width: "200px",
            },
            {
                text: "과제 설명",
                align: "left",
            },
            {
                text: "언어",
                width: "100px",
            },
            {
                text: "제출 여부",
                width: "100px",
            },
            {
                text: "제출 기간",
                width: "160px",
            },
        ];
        childElement = list.map((item, idx) => {
            return (
                <tr key={item.taskIdx} onClick={(e) => handleTask(item)}>
                    <td align="left">{item.title}</td>
                    <td align="left">{item.content}</td>
                    <td align="center">
                        <Language language={item.language}></Language>
                    </td>
                    <td
                        className={
                            item.isSubmission
                                ? "submitType color-blue"
                                : "submitType  "
                        }
                        align="center"
                    >
                        {item.isSubmission ? "제출" : "미제출"}
                    </td>
                    <td align="center">
                        {Util.dateForm(item.expireDate, "full")}
                    </td>
                </tr>
            );
        });
    } else {
        headerItem = [
            {
                text: "과제 명",
                align: "left",
                width: "200px",
            },
            {
                text: "과제 설명",
                align: "left",
            },
            {
                text: "제출 기간",
                width: "160px",
            },
            {
                text: "연장 기간",
                width: "160px",
            },
        ];
        childElement = list.map((item, idx) => {
            return (
                <tr key={item.taskIdx} onClick={(e) => handleTask(item)}>
                    <td align="left">{item.title}</td>
                    <td align="left">{item.content}</td>
                    <td align="center">
                        {Util.dateForm(item.expireDate, "full")}
                    </td>
                    <td align="center">
                        {Util.dateForm(item.extendDate, "full")}
                    </td>
                </tr>
            );
        });
        createBtnElem = <FloatingMenu onClick={handleFloating}></FloatingMenu>;
    }

    return (
        <MainLayout>
            <Table header={headerItem} className="lectureTable">
                {childElement}
            </Table>
            {createBtnElem}
        </MainLayout>
    );
};

export default inject(
    "storeMain",
    "storeLecture",
    "storeTask"
)(observer(AssignmentListPage));
