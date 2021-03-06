/*
This file is part of the Juju GUI, which lets users view and manage Juju
environments within a graphical interface (https://launchpad.net/juju-gui).
Copyright (C) 2015 Canonical Ltd.

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU Affero General Public License version 3, as published by
the Free Software Foundation.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranties of MERCHANTABILITY,
SATISFACTORY QUALITY, or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero
General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

'use strict';

var juju = {components: {}}; // eslint-disable-line no-unused-vars

describe('MachineViewUnplacedUnit', function() {
  var acl;

  beforeAll(function(done) {
    // By loading this file it adds the component to the juju components.
    YUI().use('machine-view-unplaced-unit', function() { done(); });
  });

  beforeEach(() => {
    acl = {isReadOnly: sinon.stub().returns(false)};
  });

  it('can render', function() {
    var removeUnit = sinon.stub();
    var unit = {displayName: 'django/7'};
    var renderer = jsTestUtils.shallowRender(
      // The component is wrapped to handle drag and drop, but we just want to
      // test the internal component so we access it via DecoratedComponent.
      <juju.components.MachineViewUnplacedUnit.DecoratedComponent
        acl={acl}
        connectDragSource={jsTestUtils.connectDragSource}
        createMachine={sinon.stub()}
        icon="icon.svg"
        isDragging={false}
        machines={{}}
        placeUnit={sinon.stub()}
        removeUnit={removeUnit}
        selectMachine={sinon.stub()}
        unit={unit} />, true);
    var instance = renderer.getMountedInstance();
    var output = renderer.getRenderOutput();
    var expected = (
      <li className="machine-view__unplaced-unit">
        <img src="icon.svg" alt="django/7"
          className="machine-view__unplaced-unit-icon" />
        django/7
        <juju.components.MoreMenu
          items={[{
            label: 'Deploy to...',
            action: instance._togglePlaceUnit
          }, {
            label: 'Destroy',
            action: output.props.children[2].props.items[1].action
          }]} />
          {undefined}
          <div className="machine-view__unplaced-unit-drag-state"></div>
      </li>);
    assert.deepEqual(output, expected);
  });

  it('can display in dragged mode', function() {
    var removeUnit = sinon.stub();
    var unit = {displayName: 'django/7'};
    var output = jsTestUtils.shallowRender(
      // The component is wrapped to handle drag and drop, but we just want to
      // test the internal component so we access it via DecoratedComponent.
      <juju.components.MachineViewUnplacedUnit.DecoratedComponent
        acl={acl}
        connectDragSource={jsTestUtils.connectDragSource}
        createMachine={sinon.stub()}
        icon="icon.svg"
        isDragging={true}
        machines={{}}
        placeUnit={sinon.stub()}
        removeUnit={removeUnit}
        selectMachine={sinon.stub()}
        unit={unit} />);
    var expected = (
      <li className={'machine-view__unplaced-unit ' +
        'machine-view__unplaced-unit--dragged'}>
        {output.props.children}
      </li>);
    assert.deepEqual(output, expected);
  });

  it('can remove a unit', function() {
    var removeUnit = sinon.stub();
    var unit = {displayName: 'django/7', id: 'django/7'};
    var output = jsTestUtils.shallowRender(
      // The component is wrapped to handle drag and drop, but we just want to
      // test the internal component so we access it via DecoratedComponent.
      <juju.components.MachineViewUnplacedUnit.DecoratedComponent
        acl={acl}
        connectDragSource={jsTestUtils.connectDragSource}
        createMachine={sinon.stub()}
        icon="icon.svg"
        isDragging={false}
        machines={{}}
        placeUnit={sinon.stub()}
        removeUnit={removeUnit}
        selectMachine={sinon.stub()}
        unit={unit} />);
    output.props.children[2].props.items[1].action();
    assert.equal(removeUnit.callCount, 1);
    assert.equal(removeUnit.args[0][0], 'django/7');
  });

  it('disables the menu items when read only', function() {
    acl.isReadOnly = sinon.stub().returns(true);
    var removeUnit = sinon.stub();
    var unit = {displayName: 'django/7'};
    var renderer = jsTestUtils.shallowRender(
      // The component is wrapped to handle drag and drop, but we just want to
      // test the internal component so we access it via DecoratedComponent.
      <juju.components.MachineViewUnplacedUnit.DecoratedComponent
        acl={acl}
        connectDragSource={jsTestUtils.connectDragSource}
        createMachine={sinon.stub()}
        icon="icon.svg"
        isDragging={false}
        machines={{}}
        placeUnit={sinon.stub()}
        removeUnit={removeUnit}
        selectMachine={sinon.stub()}
        unit={unit} />, true);
    var output = renderer.getRenderOutput();
    var expected = (
      <juju.components.MoreMenu
        items={[{
          label: 'Deploy to...',
          action: false
        }, {
          label: 'Destroy',
          action: false
        }]} />);
    assert.deepEqual(output.props.children[2], expected);
  });
});
