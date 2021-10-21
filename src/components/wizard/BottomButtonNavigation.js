import React, { Component } from "react";
import { WithWizard } from 'react-albus';
import { Button } from "reactstrap";

export class BottomButtonNavigation extends Component {
    render() {
        return (
            <WithWizard render={({ next, previous, step, steps }) => (
                <div className={"wizard-buttons " + this.props.className}>
                    <Button color="secondary"
                        className={(steps.indexOf(step) >= steps.length - 1 ? "disabled" : "")}
                        onClick={() => { this.props.onClickNext(next, steps, step) }}>
                        {(steps.indexOf(step) === 0 ? this.props.continueLabel : (steps.indexOf(step) === 1 ? this.props.finishLabel : this.props.paymentLabel))}
                    </Button>
                </div>
            )} />
        )
    }
}
