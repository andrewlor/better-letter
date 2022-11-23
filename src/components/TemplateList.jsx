import React, { useState } from 'react'
import { connect } from 'react-redux'
import TemplateListItem from './TemplateListItem'
import './TemplateList.sass'
import { DELETE_TEMPLATE_REQUESTED } from '../redux'

const TemplateList = ({
    selectedId,
    templates,
    deleteTemplate,
    handleTemplateClick,
}) => {
    const isEmpty = templates?.length === 0

    return (
        <div className={`template-list ${isEmpty && 'empty'}`}>
            {templates?.map((t, i) => (
                <React.Fragment key={i}>
                    <TemplateListItem
                        template={t}
                        selected={t.id === selectedId}
                        onClick={() => handleTemplateClick(t.id)}
                        onDelete={() => deleteTemplate(t.id)}
                    />
                </React.Fragment>
            ))}
            {isEmpty && (
                <>
                    <h3>No template documents</h3>
                    <p>Use + to add one</p>
                </>
            )}
        </div>
    )
}

export default connect(null, (dispatch) => ({
    deleteTemplate: (id) => dispatch(DELETE_TEMPLATE_REQUESTED(id)),
}))(TemplateList)
