/*!
 * WULF v1.2.6 (http://wulf-demo.dynamic.nsn-net.net/)
 * Copyright 2016 Nokia Solutions and Networks. All rights Reserved.
 */



( function( factory ) {
	if ( typeof define === 'function' && define.amd ) {
		define( [ 'jquery', 'moment-timezone',
			'bootstrap',
			'fuelux/datepicker',
			'fuelux/selectlist',
			'fuelux/tree',
			'fuelux/combobox',
			'fuelux/spinbox',
			'malihu-custom-scrollbar-plugin',
			'twitter-bootstrap-wizard',
			'jqxcore',
			'jqxdata',
			'jqxbuttons',
			'jqxscrollbar',
			'jqxmenu',
			'jqxcheckbox',
			'jqxlistbox',
			'jqxdropdownlist',
			'jqxgrid',
			'jqxgrid.filter',
			'jqxgrid.pager',
			'jqxgrid.sort',
			'jqxgrid.edit',
			'jqxgrid.selection',
			'jqxgrid.columnsresize',
			'jqxgrid.columnsreorder',
			'jqxpanel',
			'jqxcombobox',
			'jqxdatatable',
			'jqxtreegrid',
			'jqxdraw',
			'jqxchart.core',
			'jqxchart'
		], factory );
	} else if ( typeof module === 'object' && module.exports ) {
		module.exports = function( root, jQuery ) {
			if ( jQuery === undefined ) {
				if ( typeof window !== 'undefined' ) {
					jQuery = require( 'jquery' );

				} else {
					jQuery = require( 'jquery' )( root );
				}
			}
			factory( jQuery, require( 'moment-timezone' ), require( 'bootstrap' ), require( 'fuelux' ), require( 'jquery-mousewheel' ), require( 'malihu-custom-scrollbar-plugin' ), require( 'twitter-bootstrap-wizard' ), require( 'jqwidgets-framework/jqwidgets/jqx-all' ) );
			return jQuery;
		};
	} else {
		factory( jQuery );
	}
}( function( $, moment ) {
	'use strict';
	/* jshint ignore:start */
	if ( typeof $ === 'undefined' ) {
		throw new Error( 'WULF\'s JavaScript requires jQuery' )
	}

	var version = $.fn.jquery.split( ' ' )[ 0 ].split( '.' )
	if ( ( version[ 0 ] < 2 && version[ 1 ] < 9 ) || ( version[ 0 ] == 1 && version[ 1 ] == 9 && version[ 2 ] < 1 ) ) {
		throw new Error( 'WULF\'s JavaScript requires jQuery version 1.9.1 or higher' )
	}
	//keyboard-core.js
	( function( $ ) {

		var SPACE_BAR_KEY = 32;
		var LEFT_KEY = 37;
		var RIGHT_KEY = 39;
		var UP_KEY = 38;
		var DOWN_KEY = 40;
		var ESC_KEY = 27;
		var TAB_KEY = 9;

		var KeyboardCore = {
			commonKeyboardHandler: function( e ) {
				var supportKeys = [ TAB_KEY, SPACE_BAR_KEY, UP_KEY, DOWN_KEY, LEFT_KEY, RIGHT_KEY, ESC_KEY ];

				if ( supportKeys.indexOf( e.keyCode ) === -1 ) {
					return;
				}

				if ( e.data && e.data.notSupport ) {
					if ( e.data.notSupport.indexOf( e.keyCode ) !== -1 ) {
						return;
					}
				}

				var target = $( e.target );

				if ( e.keyCode !== TAB_KEY ) {
					e.preventDefault();
				}

				var parent, nextItem;

				//Handle focus status
				switch ( e.keyCode ) {
					case TAB_KEY:
						if ( target.get( 0 ).tagName === "A" && target.closest( "ul" ).closest( "div" ).hasClass( "selectlist-multiple" ) ) {
							target.find( "input[type='checkbox']" ).focus();
						}
						//Handle scrollbar status
						parent = getRootNode( $( e.target ) );
						nextItem = getNextItem( parent, e );
						if ( isScrollNeeded( parent, nextItem ) ) {
							$( parent ).mCustomScrollbar( 'scrollTo', nextItem, {
								scrollInertia: 0
							} );
						}
						break;
					case ESC_KEY:
						if ( target.get( 0 ).tagName === "A" && target.closest( "ul" ).closest( "div" ).hasClass( "selectlist-multiple" ) ) {
							target.closest( ".dropdown-menu" ).prev().trigger( 'click' );
						} else if ( target.get( 0 ).tagName === "INPUT" && target.closest( "ul" ).closest( "div" ).hasClass( "selectlist-multiple" ) ) {
							//target is input, somewhere call this section again, so need stop event propagation
							target.closest( ".dropdown-menu" ).prev().trigger( 'click' );
							e.stopPropagation();
						}
						break;
					case SPACE_BAR_KEY:
						if ( target.get( 0 ).tagName === "A" && target.closest( "ul" ).closest( "div" ).hasClass( "selectlist-multiple" ) ) {
							target.find( "input[type='checkbox']" ).trigger( 'click' );
						} else if ( target.get( 0 ).tagName === "INPUT" && target.closest( "ul" ).closest( "div" ).hasClass( "selectlist-multiple" ) ) {
							//target is input, somewhere call this section again, so need stop event propagation
							target.trigger( 'click' );
							e.stopPropagation();
						} else if ( target.is( 'li' ) && target.parent().hasClass( 'n-banner-nav' ) ) {
							if ( !target.closest( 'li' ).hasClass( 'disabled' ) ) {
								target.tab( 'show' );
							}
						} else if ( target.hasClass( "n-close" ) ) {
							target.find( ".icon-close" ).click();
						} else {
							target.trigger( 'click' );
						}
						break;
					case UP_KEY:
					case DOWN_KEY:
						parent = getRootNode( $( e.target ) );
						nextItem = getNextItem( parent, e );
						nextItem.trigger( 'focus' );
						//Handle scrollbar status
						if ( isScrollNeeded( parent, nextItem ) ) {
							$( parent ).mCustomScrollbar( 'scrollTo', nextItem, {
								scrollInertia: 0
							} );
						}
						break;
					case LEFT_KEY:
					case RIGHT_KEY:
						if ( target.is( 'a' ) && ( target.closest( 'ul' ).hasClass( 'n-banner-nav' ) ||
								target.closest( 'ul' ).hasClass( 'nav-tabs' ) ) ) {
							parent = getRootNode( target );
							nextItem = getNextItem( parent, e );
							nextItem.trigger( 'focus' );
						}
						break;
					default:
						break;
				}
			},

			getAllVisibleSubItems: function( target ) {
				return getAllVisibleSubItems( target );
			},

			isScrollNeeded: function( parent, item ) {
				return isScrollNeeded( parent, item );
			},

			isHiddenElement: function( target ) {
				return isHiddenElement( target );
			}
		};

		// KEYBOARD CORE INTERNAL METHODS
		// ==============================

		function getRootNode( target ) {
			if ( target.hasClass( 'n-list-group-item' ) ) {
				if ( target.is( 'dd' ) ) {
					return target.closest( 'dl' );
				}
				return target.closest( 'ul' );
			}

			if ( target.hasClass( 'tree-branch-name' ) || target.hasClass( 'tree-item-name' ) ) {
				return target.closest( 'ul.tree' );
			}

			return target.closest( 'ul' );
		}

		function getNextItem( parent, e ) {
			var items = getAllVisibleSubItems( parent );
			var indx = items.index( e.target );
			switch ( e.keyCode ) {
				case TAB_KEY: // Tab or Shift+tab
					indx = ( e.shiftKey ? ( indx > 0 ? indx - 1 : 0 ) : ( indx < items.length - 1 ? indx + 1 : items.length - 1 ) );
					break;
				case LEFT_KEY:
				case UP_KEY:
					indx = indx > 0 ? indx - 1 : 0;
					break;
				case RIGHT_KEY:
				case DOWN_KEY:
					indx = indx < items.length - 1 ? indx + 1 : items.length - 1;
					break;
				default:
					break;
			}
			return items.eq( indx );
		}

		function getAllVisibleSubItems( target ) {
			if ( target.children().children().hasClass( "datepicker" ) ) {
				return target.children();
			}
			if ( target.children().hasClass( "datepicker" ) ) {
				return target.parent().children();
			}
			if ( target.prev().children().hasClass( "datepicker" ) ) {
				return target.parent().children();
			}

			if ( $( target ).hasClass( 'n-list-group' ) ) {
				if ( $( target ).is( 'dl' ) ) {
					return target.find( 'dd' );
				}
				return target.find( 'li' );
			}

			if ( $( target ).hasClass( 'n-flyout-menu' ) ) {
				return target.find( 'li a' );
			}

			if ( $( target ).hasClass( 'n-banner-tabs' ) || $( target ).hasClass( 'nav-tabs' ) ) {
				return target.children( 'li' ).children( 'a' );
			}

			if ( $( target ).hasClass( 'dropdown-menu' ) ) {
				return target.find( 'li' ).children( 'a:not([disabled])' );
			}
			if ( $( target ).hasClass( 'tree' ) ) {
				var itemArr = [];
				var items = target.find( 'li:not(.hide) a' );
				for ( var i = 0; i <= items.length - 1; i++ ) {
					if ( !isTreeItemHidden( $( items[ i ] ) ) ) {
						itemArr.push( items[ i ] );
					}
				}
				return $( itemArr );
			}
			if ( $( target ).is( 'tr' ) && !isHiddenElement( target ) ) {
				return target.find( 'td' );
			}
			return target.find( 'li' );
		}

		function isScrollNeeded( parent, item ) {
			if ( $( parent ).find( '.mCSB_container' ).length === 0 ) {
				return;
			}
			if ( $( item ).closest( 'table' ).hasClass( 'datepicker-calendar-days' ) ) {
				return;
			}

			var parentTop = $( parent ).offset().top;
			var itemTop = $( item ).offset().top;
			var parentHeight = $( parent ).get( 0 ).clientHeight;
			var itemHeight = item.get( 0 ).offsetHeight;
			var topDiff = itemTop - parentTop;
			var bottomDiff = topDiff + itemHeight;
			return ( topDiff < 10 || bottomDiff > parentHeight - 10 );
		}

		function isTreeItemHidden( target ) {
			var isHidden = false;
			var parent = target.parent();
			while ( !parent.hasClass( 'tree' ) && !parent.is( 'html' ) ) {
				if ( parent.closest( 'ul' ).hasClass( 'hidden' ) ) {
					isHidden = true;
					break;
				}
				parent = parent.parent();
			}
			return isHidden;
		}

		function isHiddenElement( target ) {
			var display = target.css( 'display' ) === 'none';
			var visibility = target.css( 'visibility' ) === 'hidden';
			var height = target.height() === 0;
			return display || visibility || height;
		}

		$( document )
			/** add keyboard event for pull down && combo box*/
			.on( 'keydown.wf.common.keyboard', '.dropdown-menu', KeyboardCore.commonKeyboardHandler )
			//.on('keydown.wf.selectlist.keyboard', '.selectlist', KeyboardCore.commonKeyboardHandler)
			.on( 'keydown.wf.common.keyboard', '.icon-close', {
				notSupport: [ UP_KEY, DOWN_KEY ]
			}, KeyboardCore.commonKeyboardHandler )
			.on( 'keydown.wf.common.keyboard', '.n-close', {
				notSupport: [ UP_KEY, DOWN_KEY ]
			}, KeyboardCore.commonKeyboardHandler )
			.on( 'keydown.wf.common.keyboard', 'a[data-toggle=modal]', KeyboardCore.commonKeyboardHandler );

		$.wfKBCore = KeyboardCore;

	} )( $ );


	//keyboard-tree.js
	( function( $ ) {

		var SPACE_BAR_KEY = 32;
		var LEFT_KEY = 37;
		var RIGHT_KEY = 39;

		$.wfKBTree = {
			treeKeyboardHandler: function( e ) {
				var iconFolder;
				switch ( e.which ) {
					case SPACE_BAR_KEY:
						var href = $( e.target ).attr( "href" );
						if ( href !== "" && href !== "#" ) {
							var target = $( e.target ).attr( "target" );
							var targetParent = window.parent.document.getElementById( target );
							var targetSelf = document.getElementById( target );
							if ( targetParent !== null ) {
								targetParent.src = href;
							} else if ( targetSelf !== null ) {
								targetSelf.src = href;
							} else {
								location.href = href;
							}
						}

						var currentStatus = $( e.target ).find( "input" ).prop( "checked" );
						var targetStatus = !currentStatus;
						$( e.target ).find( "input" ).prop( "checked", targetStatus );
						updateTree();

						break;
					case LEFT_KEY:
						var iconCaret = $( e.target ).find( ".icon-caret" );
						if ( iconCaret.length > 0 ) {
							if ( $( e.target ).find( '.glyphicon-folder-open' ).length ) {
								$( iconCaret ).trigger( "click" );
							}
						}
						// This is for table item that does not have the caret icon
						iconFolder = $( e.target ).find( ".icon-folder" );
						if ( iconFolder.length > 0 ) {
							if ( iconFolder.hasClass( 'glyphicon-folder-open' ) ) {
								$( e.target ).trigger( "click" );
							}
						}
						break;
					case RIGHT_KEY:
						iconCaret = $( e.target ).find( ".icon-caret" );
						if ( iconCaret.length > 0 ) {
							if ( $( e.target ).find( '.glyphicon-folder-close' ).length ) {
								$( iconCaret ).trigger( "click" );
							}
						}
						// This is for table item that does not have the caret icon
						iconFolder = $( e.target ).find( ".icon-folder" );
						if ( iconFolder.length > 0 ) {
							if ( iconFolder.hasClass( 'glyphicon-folder-close' ) ) {
								$( e.target ).trigger( "click" );
							}
						}
						break;
				}

				$.wfKBCore.commonKeyboardHandler( e );
			}
		};

		// KEYBOARD TREE INTERNAL METHODS
		// ==============================

		function updateTree() {
			$( ".tree-branch-name > .checkbox > input[name='folder']" ).each( function() {
				var statuses = [];
				$( this ).closest( ".tree-branch" ).find( "input[name='file']" ).each(
					function() {
						statuses.push( $( this ).prop( "checked" ) );
					}
				);
				if ( statuses.length !== 0 ) {
					var allfileschecked = statuses.reduce( function( a, b ) {
						return a && b;
					} );
					var partfilechecked = statuses.reduce( function( a, b ) {
						return a || b;
					} );
					$( this ).prop( "checked", allfileschecked );
					if ( allfileschecked ) {
						$( this ).prop( {
							checked: true,
							indeterminate: false
						} );
					} else if ( partfilechecked ) {
						$( this ).prop( {
							checked: false,
							indeterminate: true
						} );
					} else {
						$( this ).prop( {
							checked: false,
							indeterminate: false
						} );
					}
				}
			} );
		}

	} )( $ );


	//keyboard-table.js
	( function( $ ) {

		var ENTER_KEY = 13;
		var SPACE_BAR_KEY = 32;
		var LEFT_KEY = 37;
		var RIGHT_KEY = 39;
		var UP_KEY = 38;
		var DOWN_KEY = 40;
		var TAB_KEY = 9;

		$.wfKBTable = {
			tableKeyboardHandler: function( e ) {
				var supportKeys = [ TAB_KEY, SPACE_BAR_KEY, ENTER_KEY, LEFT_KEY, RIGHT_KEY, UP_KEY, DOWN_KEY ];
				var selectedClassName = 'n-cell-selected';

				if ( supportKeys.indexOf( e.which ) === -1 ) {
					return;
				}

				initTableSelected( e, selectedClassName );

				switch ( e.keyCode ) {
					case SPACE_BAR_KEY:
					case ENTER_KEY:
						handleTableSpaceAndEntryKeyboardAction( e );
						break;
					case LEFT_KEY:
					case RIGHT_KEY:
					case UP_KEY:
					case DOWN_KEY:
						handleTableDirectionKeyAction( e, selectedClassName );
						break;
					case TAB_KEY:
						handleTableTabKeyboardAction( e, selectedClassName );
						break;
				}
			},

			handleTableDirectionKeyAction: function( e, className ) {
				handleTableDirectionKeyAction( e, className );
			}
		};

		// KEYBOARD TABLE INTERNAL METHODS
		// ===============================

		function initTableSelected( e, className ) {
			var current = $( e.target );

			// Remove the selected class for all items in table
			current.closest( 'table' ).find( 'td' ).each( function() {
				$( this ).removeClass( className );
			} );

			// Only keep the selected class for current item
			if ( current.is( 'td' ) ) {
				if ( current.closest( 'table' ).hasClass( 'n-table-hover' ) ) {
					current.closest( 'tr' ).find( 'td' ).each( function() {
						$( this ).addClass( className );
					} );
				} else {
					current.addClass( className );
				}
			}
		}

		function handleTableSpaceAndEntryKeyboardAction( e ) {
			var current = $( e.target );
			if ( current.is( 'td' ) ) {
				// If the current focus is on table element, prevent the default key action.
				e.preventDefault();
				$( e.target ).trigger( 'click' );
				if ( current.find( 'input' ).length > 0 ) {
					// If the focused element is input filed or checkbox.
					current.find( 'input' ).focus();

					// If the focused element is dropdown list.
					if ( current.find( '.selectlist' ).length > 0 ) {
						current.find( 'button' ).trigger( "click" );
					}

					//WULF-867 calendar keyboard support in table
					if ( current.find( '.n-calendar' ).length > 0 ) {
						current.find( 'button' ).focus();
					}
				}
			}
		}

		function handleTableDirectionKeyAction( e, className ) {
			var current = $( e.target );

			// If the current focus is on table element, prevent the default key action.
			if ( ( current.attr( 'type' ) !== 'text' ) && ( !current.is( 'td' ) ) && current.find( '.n-calendar' ).length <= 0 ) {
				// dropup the possible list element.
				collapseListInTable( current );
				current = current.closest( 'td' );
			}

			var target = getNextTableItem( current, e );

			// Remove the selected class on current element and add selected class to target element.
			if ( target.length > 0 && !( current.hasClass( 'n-inputfield' ) && current.parent().hasClass( 'n-calendar' ) ) ) {
				e.preventDefault();
				if ( !current.closest( 'table' ).hasClass( 'n-table-hover' ) ) {
					//WULF-867 calendar keyboard support in table
					if ( !current.closest( 'table' ).hasClass( 'datepicker-calendar-days' ) &&
						( e.keyCode === LEFT_KEY || e.keyCode === RIGHT_KEY || e.keyCode === UP_KEY || e.keyCode === DOWN_KEY ) &&
						current.find( '.datepicker' ).find( '.dropdown-toggle' ).attr( 'aria-expanded' ) === 'true' ) {
						current.find( '.datepicker' ).find( '.dropdown-toggle' ).trigger( 'click' ).blur();
					}
					current.removeClass( className );
					target.addClass( className );
				} else {
					current.closest( 'tr' ).find( 'td' ).each( function() {
						$( this ).removeClass( className );
					} );
					target.closest( 'tr' ).find( 'td' ).each( function() {
						$( this ).addClass( className );
					} );
				}
				current.removeAttr( 'tabindex' );
				target.attr( 'tabindex', 0 );
				target.trigger( 'focus' );
			}

			//Handle scrollbar status
			var parent = target.closest( '.n-table-scrollbar' );
			if ( $.wfKBCore.isScrollNeeded( parent, target ) ) {
				$( parent ).mCustomScrollbar( 'scrollTo', target, {
					scrollInertia: 0
				} );
			}
		}

		function handleTableTabKeyboardAction( e, className ) {
			var current = $( e.target );
			current.removeAttr( 'tabindex' );
			current.closest( '.n-table' ).find( 'td' ).each( function() {
				$( this ).removeClass( className );
			} );
		}

		function getNextTableItem( current, e ) {
			if ( current.hasClass( "n-inputfield" ) && !current.parent().hasClass( 'n-calendar' ) ) {
				current = current.closest( 'td' );
			}

			var items = $.wfKBCore.getAllVisibleSubItems( current.parent() );

			var index = items.index( current );
			var prev, next;
			switch ( e.keyCode ) {
				case TAB_KEY:
					if ( e.shiftKey ) {
						if ( index > 0 ) {
							index--;
						} else {
							index = items.length - 1;
							prev = current.parent().prev();
							while ( $.wfKBCore.isHiddenElement( prev ) ) {
								prev = prev.prev();
							}
							items = $.wfKBCore.getAllVisibleSubItems( prev );
						}
					} else {
						if ( index < items.length - 1 ) {
							index++;
						} else {
							index = 0;
							next = current.parent().next();
							while ( $.wfKBCore.isHiddenElement( next ) ) {
								next = next.next();
							}
							items = $.wfKBCore.getAllVisibleSubItems( next );
						}
					}
					break;
				case LEFT_KEY:
					index = index > 0 ? index - 1 : 0;
					break;
				case RIGHT_KEY:
					index = index < items.length - 1 ? index + 1 : items.length - 1;
					break;
				case UP_KEY:
					prev = current.parent().prev();
					while ( $.wfKBCore.isHiddenElement( prev ) ) {
						prev = prev.prev();
					}
					items = prev.length > 0 ? $.wfKBCore.getAllVisibleSubItems( prev ) : items;
					break;
				case DOWN_KEY:
					next = current.parent().next();
					while ( $.wfKBCore.isHiddenElement( next ) ) {
						next = next.next();
					}
					items = next.length > 0 ? $.wfKBCore.getAllVisibleSubItems( next ) : items;
					break;
				default:
					break;
			}
			return items.eq( index );
		}

		/**
		 * Dropup the list if the element is a dropdown list.
		 *
		 * @param current - the current focused element.
		 */
		function collapseListInTable( current ) {
			if ( current.closest( 'div' ).hasClass( 'selectlist' ) ) {
				if ( current.closest( 'div' ).find( 'button' ).attr( 'aria-expanded' ) === 'true' ) {
					current.closest( 'div' ).find( 'button' ).trigger( 'click' );
				}
			}
		}

	} )( $ );


	//keyboard-calendar.js
	( function( $ ) {

		var ENTER_KEY = 13;
		var SPACE_BAR_KEY = 32;
		var LEFT_KEY = 37;
		var RIGHT_KEY = 39;
		var UP_KEY = 38;
		var DOWN_KEY = 40;
		var TAB_KEY = 9;

		$.wfKBCalendar = {
			calendarKeyboardHandler: function( e ) {
				var supportKeys = [ TAB_KEY, SPACE_BAR_KEY, ENTER_KEY, LEFT_KEY, RIGHT_KEY, UP_KEY, DOWN_KEY ];
				var selectedClassName = 'selected';

				if ( supportKeys.indexOf( e.which ) === -1 ) {
					return;
				}

				initDatePickerSelected( e, selectedClassName );

				switch ( e.keyCode ) {
					case LEFT_KEY:
					case RIGHT_KEY:
					case UP_KEY:
					case DOWN_KEY:
						handleCalendarDirectionKeyAction( e, selectedClassName );
						break;
					case TAB_KEY:
						handleCalendarTabKeyboardAction( e, selectedClassName );
						break;
					case SPACE_BAR_KEY:
					case ENTER_KEY:
						$( e.target ).find( 'button' ).trigger( 'click' );
						break;
				}
			},

			calendarFocusinHandler: function( e ) {
				var td = $( e.target ).closest( 'td' );
				if ( !td.hasClass( 'selected' ) ) {
					initDatePickerSelected( e, 'selected' );
				}
			}
		};

		// KEYBOARD CALENDAR INTERNAL METHODS
		// ==================================

		function initDatePickerSelected( e, className ) {
			var current = $( e.target );
			current.closest( 'table' ).find( 'td' ).each( function() {
				$( this ).removeClass( className );
			} );
		}

		function handleCalendarDirectionKeyAction( e, className ) {
			$.wfKBTable.handleTableDirectionKeyAction( e, className );
		}

		function handleCalendarTabKeyboardAction( e, className ) {
			var current = $( e.target );
			current.removeAttr( 'tabindex' );
			current.closest( '.datepicker-calendar-days' ).find( 'td' ).each( function() {
				$( this ).removeClass( className );
			} );
		}

	} )( $ );


	//keyboard-grid.js
	( function( $ ) {

		$.wfKBGrid = {
			gridFocusinHandler: function( e ) {
				var current = $( e.target );
				var id = current.attr( 'id' );
				if ( id !== undefined && ( id.indexOf( 'wrapper' ) === 0 || id.indexOf( 'content' ) === 0 || id.indexOf( 'tree' ) === 0 ) ) {
					if ( isTreeGrid( current ) ) {
						// For tree table grid
						treeJQTableFocusinHandler( current );
					} else {
						var grid = current.closest( '.jqx-grid' );
						if ( grid.length > 0 ) {
							//if (isFilterGrid(current)) {
							//    if (!isFilterGridHeader(current)) {
							//        standardJqTableFocusinHandler(grid);
							//    }
							//} else if (isPagingGrid(current)) {
							//    if (!isPagingGridPager(current)) {
							//        standardJqTableFocusinHandler(grid);
							//    }
							//} else {
							//    standardJqTableFocusinHandler(grid);
							//}
							if ( isPagingGrid( current ) ) {
								if ( !isPagingGridPager( current ) ) {
									standardJqTableFocusinHandler( grid );
								}
							}
						}
					}
				}
			}
		};

		function treeJQTableFocusinHandler( current ) {
			var keyIndex = current.find( 'tr:first' ).data( 'key' );
			var isFocused = false;
			var isTreeGrid = false;
			current.find( 'td' ).each( function() {
				if ( $( this ).hasClass( 'jqx-grid-cell-selected' ) && $( this ).hasClass( 'jqx-fill-state-pressed' ) ) {
					isFocused = true;
				}
				if ( $( this ).find( 'span:first' ).hasClass( 'jqx-tree-grid-collapse-button' ) ) {
					isTreeGrid = true;
				}
			} );
			if ( !isFocused && isTreeGrid ) {
				current.jqxTreeGrid( 'selectRow', keyIndex );
			}
		}

		function standardJqTableFocusinHandler( current ) {
			var selectedMode = current.jqxGrid( 'selectionmode' );
			if ( selectedMode.indexOf( 'cell' ) >= 0 ) {
				var cells = current.jqxGrid( 'getselectedcells' );
				if ( cells.length === 0 ) {
					focusOnFirstElementInPage( current );
				}
			} else if ( selectedMode.indexOf( 'row' ) >= 0 ) {
				if ( current.jqxGrid( 'getselectedrowindex' ) === -1 ) {
					current.jqxGrid( 'clearselection' );
					current.jqxGrid( 'selectrow', 0 );
				}
			}
		}

		function focusOnFirstElementInPage( current ) {
			var datainformation = current.jqxGrid( 'getdatainformation' );
			var paginginformation = datainformation.paginginformation;
			var pagenum = paginginformation.pagenum;
			var pagesize = paginginformation.pagesize;
			current.jqxGrid( 'clearselection' );
			current.jqxGrid( 'selectcell', pagenum * pagesize, current.jqxGrid( 'columns' ).records[ 0 ].datafield );
		}

		function isTreeGrid( current ) {
			var treeGrid = false;
			current.find( 'td' ).each( function() {
				if ( $( this ).find( 'span:first' ).hasClass( 'jqx-tree-grid-collapse-button' ) ) {
					treeGrid = true;
				}
			} );
			return treeGrid;
		}

		function isPagingGrid( current ) {
			var isPager = false;
			var grid = current.closest( '.jqx-grid' );
			var pager = grid.find( '.jqx-grid-pager' );
			if ( pager.length > 0 && pager.height() > 0 ) {
				if ( pager.find( '.n-table-paging-middle' ).length > 0 ) {
					isPager = true;
				}
			}
			return isPager;
		}

		function isPagingGridPager( current ) {
			return current.closest( '.jqx-grid-pager' ).length !== 0;
		}

	} )( $ );


	//scroll.js
	( function( $ ) {

		function showDropdownScrollbar( obj ) {
			return function() {
				$( obj ).parent().find( '.n-dropdown-menu-scroll' ).mCustomScrollbar( "update" );
			};
		}

		$.fn.extend( {
			nScrollbar: function( options ) {
				var $select = $( this );

				if ( typeof options === "string" ) {
					$select.mCustomScrollbar( options );
					return;
				}

				if ( $select.hasClass( "n-dropdown-menu-scroll" ) || $select.hasClass( "tree-scroll" ) || $select.hasClass( "n-table-scrollbar" ) ||
					( $select.hasClass( "n-list-group-scroll" ) && ( $select.find( "li.n-list-group-item" ).length > 0 || $select.find( "dd.n-list-group-item" ).length > 0 ) ) ) {
					options = $.extend( {}, options, {
						keyboard: {
							enable: false
						}
					} );
				}
				if ( $select.hasClass( "n-table-scrollbar" ) && $select.find( ".datepicker-calendar" ).length > 0 ) {
					options = $.extend( {}, options, {
						advanced: {
							autoScrollOnFocus: false
						}
					} );
				}

				if ( ( options !== undefined && options.notAutoUpdate ) || $select.hasClass( "scrollbar-not-autoupdate" ) ) {
					if ( $select.hasClass( "n-table-scrollbar" ) && $select.find( ".datepicker-calendar" ).length > 0 ) {
						options = $.extend( {}, options, {
							advanced: {
								autoScrollOnFocus: false,
								updateOnContentResize: false,
								updateOnImageLoad: false,
								autoUpdateTimeout: 100
							}
						} );
					} else {
						options = $.extend( {}, options, {
							advanced: {
								updateOnContentResize: false,
								updateOnImageLoad: false,
								autoUpdateTimeout: 100
							}
						} );
					}

					if ( $select.hasClass( "n-dropdown-menu-scroll" ) ) {
						$( ".dropdown-toggle" ).on( "click", function() {
							setTimeout( showDropdownScrollbar( this ), 10 );
						} );
					}
				}

				options = $.extend( {}, options, {
					callbacks: {
						whileScrolling: function() {
							setTimeout( function() {
								$( '.datepicker-calendar-wrapper' ).each( function() {
									if ( $( this ).css( 'display' ) === 'block' ) {
										var input = $( this ).closest( '.n-calendar' ).find( 'input' );
										if ( input.data( 'position' ) === 'fixed' ) {
											$( this ).parent().find( 'button.dropdown-toggle' ).trigger( 'click' );
										}
									}
								} );
								$( '.dropdown-menu' ).each( function() {
									if ( $( this ).css( 'display' ) === 'block' ) {
										if ( $( this ).closest( '.selectlist' ).data( 'position' ) === 'fixed' ) {
											$( this ).parent().find( 'button.dropdown-toggle' ).trigger( 'click' );
										}
									}
								} );
							}, 100 );
						}
					}
				} );
				$select.mCustomScrollbar( options );
			}
		} );

	} )( $ );


	//dropdowns.js
	( function( $ ) {
		$.fn.extend( {
			adaptiveSelectlist: function() {
				$( this ).on( 'shown.bs.dropdown', function() {
					adjustDropdownMenuWidth( $( this ) );
				} );
			}
		} );

		$( document ).ready( function() {
			$( ".n-dropdown-menu-scroll" ).on( "click", ".mCSB_dragger_bar", function( e ) {
				e.stopPropagation();
			} );
			var nPulldownMultiple = '<p class="prompt">--Select items--</p>';
			$( '.selectlist-multiple' ).find( '.selected-label' ).empty().append( nPulldownMultiple );
			$( '.selectlist-multiple ul' ).on( 'click', function( e ) {
				e.stopPropagation();
			} );
			$( '.selectlist-multiple input[type="checkbox"]' ).on( 'click', function() {
				var html,
					tooltip = "",
					title = $( this ).next().children().text(),
					$multiSelect = $( this ).closest( '.selectlist-multiple' );
				if ( $( this ).is( ':checked' ) ) {
					if ( $multiSelect.find( '.selected-label' ).find( 'span' ).length > 0 ) {
						html = '<span wulf-title="' + title + '">' + ", " + title + '</span>';
					} else {
						html = '<span wulf-title="' + title + '">' + title + '</span>';
					}
					$multiSelect.find( '.prompt' ).hide();
					$multiSelect.find( '.selected-label' ).append( html );
					$multiSelect.find( 'button' ).find( 'span[wulf-title]' ).each( function() {
						tooltip = tooltip + $( this ).text();
					} );
					$multiSelect.find( 'button' ).attr( 'data-original-title', tooltip );
				} else {
					$multiSelect.find( 'span[wulf-title="' + title + '"]' ).remove();
					var $firstSelectedItem = $( $multiSelect.find( 'span' ).find( 'span' ).get( 0 ) );
					if ( $firstSelectedItem.text().indexOf( ", " ) === 0 ) {
						$firstSelectedItem.text( $firstSelectedItem.text().slice( 2 ) );
					}
					$multiSelect.find( 'button' ).find( 'span[wulf-title]' ).each( function() {
						tooltip = tooltip + $( this ).text();
					} );
					$multiSelect.find( 'button' ).attr( 'data-original-title', tooltip );
					if ( $multiSelect.find( '.selected-label' ).children().length === 1 ) {
						$multiSelect.find( '.prompt' ).show();
						$multiSelect.find( 'button' ).removeAttr( 'data-original-title' );
					}
				}
			} );
		} );

		$( document )
			.on( 'shown.bs.dropdown', '.n-table .selectlist', relocateDropdown )
			.on( 'scroll.wf.dropdown', closeDropdownOnScroll )
			.on( 'click.fu.selectlist', '.n-table-scrollbar .selectlist .dropdown-menu a', selectDropdownItem )
			.on( "click", ".selectlist ul li a", function() {
				var $select = $( this ).closest( '.selectlist' );
				$select.find( '.btn.dropdown-toggle' ).removeAttr( "data-original-title" );
			} )
			.on( "mouseenter", ".dropdown-menu li a", showDropdownItemTooltip )
			.on( "focus", ".dropdown-menu li a", showDropdownItemTooltip )
			.on( "mouseleave", ".dropdown-menu li a", function() {
				var $selectedElement = $( this );
				var $span = $selectedElement.find( 'span' ).not( ".checkbox" );
				$span.css( "border-bottom-color", "" );
				$span.removeClass( "active" );
			} )
			.on( "blur", ".dropdown-menu li a", function() {
				var $selectedElement = $( this );
				var $span = $selectedElement.find( 'span' ).not( ".checkbox" );
				$span.css( "border-bottom-color", "" );
				$span.removeClass( "active" );
			} )
			.on( "mouseenter", "[data-toggle='dropdown']", showDropdownBtnTooltip )
			.on( "focus", "[data-toggle='dropdown']", showDropdownBtnTooltip )
			.on( "mouseleave", "[data-toggle='dropdown']", function() {
				var $selectedElement = $( this );
				$selectedElement.tooltip( "hide" );
			} );

		$( window ).on( 'resize.wf.dropdown', closeDropdownOnScroll );
		$( window ).on( 'resize.wf.dropdown', function() {
			$( '.selectlist' ).each( function() {
				if ( $( this ).hasClass( 'open' ) ) {
					adjustDropdownMenuWidth( $( this ) );
				}
			} );
		} );

		function showDropdownItemTooltip() {
			/*jshint validthis:true */
			var $selectedElement = $( this );
			$selectedElement.removeAttr( "data-original-title" );
			var $span = $selectedElement.find( 'span' ).not( ".checkbox" );
			var currentWidth = getCurrentStrWidth( $span.html(), $span );
			if ( currentWidth >= $selectedElement.width() ) {
				$span.addClass( "active" );
				$span.css( "border-bottom-color", "transparent" );
				$selectedElement.attr( "data-original-title", $( $span ).html() );
				$selectedElement.tooltip( "show" );
			} else {
				$selectedElement.tooltip( "hide" );
			}
		}

		function showDropdownBtnTooltip() {
			/*jshint validthis:true */
			var $selectedElement = $( this );
			$selectedElement.removeAttr( "data-original-title" );
			$selectedElement.removeAttr( "title" );
			var $span = $selectedElement.find( '.selected-label' );
			var $trueSpan = $span.find( "span" );
			var valueLen = 0;
			var valuehtml = '';
			for ( var i = 0; i < $trueSpan.length; i++ ) {
				valueLen += $( $trueSpan[ i ] ).width();
				valuehtml = valuehtml.concat( $( $trueSpan[ i ] ).html() );
			}
			var currentWidth = getCurrentStrWidth( valuehtml, $span );
			if ( currentWidth >= $span.width() ) {
				$selectedElement.attr( "data-original-title", valuehtml );
				$selectedElement.tooltip( "show" );
			} else {
				$selectedElement.tooltip( "hide" );
			}
		}

		function getCurrentStrWidth( text, element ) {
			var currentObj = $( '<span>' ).hide().appendTo( document.body );
			if ( element.css( "font" ) !== "" ) {
				$( currentObj ).html( text ).css( "font", element.css( "font" ) );
			} else {
				$( currentObj ).html( text ).css( "font-size", element.css( "font-size" ) );
			}
			var width = currentObj.width();
			currentObj.remove();
			return width;
		}

		function relocateDropdown() {
			/*jshint validthis:true */
			var $dropdown = $( this );
			var ul = $dropdown.find( 'ul' );
			if ( $dropdown.data( 'position' ) === 'fixed' ) {
				ul.css( 'position', 'fixed' );
				ul.css( 'top', $( this ).offset().top + $( this ).parent().height() - $( document ).scrollTop() );
				ul.css( 'left', $( this ).offset().left - $( document ).scrollLeft() );
				ul.width( $( this ).parent().width() );
			}
		}

		function closeDropdownOnScroll() {
			$( '.dropdown-menu' ).each( function() {
				if ( $( this ).css( 'display' ) === 'block' ) {
					if ( $( this ).closest( '.selectlist' ).data( 'position' ) === 'fixed' ) {
						$( this ).parent().find( 'button.dropdown-toggle' ).trigger( 'click' );
					}
				}
			} );
		}

		function adjustDropdownMenuWidth( $select ) {
			var offset = $select.offset().left;
			var $dropDownMecu = $select.find( '> .dropdown-menu' );
			$dropDownMecu.css( 'width', 'auto' );
			var dropdownWidth = $dropDownMecu.width();
			var windowWidth = $( window ).width();
			if ( offset + dropdownWidth > windowWidth ) {
				$dropDownMecu.width( windowWidth - offset - 20 );
			}
		}

		function selectDropdownItem() {
			/*jshint validthis:true */
			var $selectlist = $( this ).closest( '.selectlist' );
			var val = $( this ).closest( 'li' ).data( 'value' );
			$selectlist.selectlist( 'selectByValue', val );
		}

	} )( $ );


	//tables.js
	( function( $ ) {

		$( document ).ready( function() {
			$( ".n-table-hover, .n-table-cell-hover" ).mousedown( function( e ) {
				if ( e.shiftKey ) {
					// For non-IE browsers
					e.preventDefault();
					// For IE
					if ( typeof $.browser !== "undefined" && $.browser.msie ) {
						this.onselectstart = function() {
							return false;
						};
						var selectionEvent = this;
						window.setTimeout( function() {
							selectionEvent.onselectstart = null;
						}, 0 );
					}
				}
			} );

			initTableScrollbar();

			//Cell selection
			$( '.n-table-cell-hover' ).on( 'click', 'td', function() {
				$( this ).closest( 'table' ).find( 'td' ).removeClass( 'n-cell-selected' );
				$( this ).closest( 'table' ).find( 'td' ).removeAttr( 'tabindex' );
				// Do not add selected class to td in tfoot.
				if ( $( this ).closest( 'tfoot' ).length <= 0 ) {
					$( this ).addClass( 'n-cell-selected' );
					$( this ).attr( 'tabindex', 0 );
					$( this ).trigger( 'focus' );
					// Cell with input field
					$( this ).children().each( function() {
						if ( $( this ).is( 'input' ) && $( this ).attr( 'type' ) === 'text' ) {
							$( this ).trigger( 'focus' );
						}
					} );
				}
			} );

			//Row selection
			var selectionPivot;
			$( '.n-table-hover' ).on( 'click', 'td', function( e ) {
				var trElements = $( this ).closest( 'table' ).find( 'tr' );
				var ctrlKeyPressed = ( window.event && window.event.ctrlKey ) || e.ctrlKey;
				var shiftKeyPressed = ( window.event && window.event.shiftKey ) || e.shiftKey;

				var isHighLighted = $( this ).closest( "tr" ).children( "td" ).hasClass( "n-cell-selected" );

				if ( $( this ).closest( 'tfoot' ).length <= 0 ) {
					$( this ).closest( "tr" ).children( "td" ).removeClass( "n-cell-selected" );
					$( this ).closest( 'table' ).find( 'td' ).removeAttr( 'tabindex' );

					if ( !ctrlKeyPressed && !shiftKeyPressed ) {
						selectionPivot = $( this ).closest( "tr" );
						$( this ).closest( 'table' ).find( 'td' ).removeClass( 'n-cell-selected' );
						$( this ).closest( "tr" ).children( "td" ).addClass( "n-cell-selected" );
					} else if ( ctrlKeyPressed && !shiftKeyPressed ) {
						selectionPivot = $( this ).closest( "tr" );
						if ( !isHighLighted ) {
							$( this ).closest( "tr" ).children( "td" ).addClass( "n-cell-selected" );
						}
					} else {
						if ( !ctrlKeyPressed ) {
							$( this ).closest( 'table' ).find( 'td' ).removeClass( 'n-cell-selected' );
						}
						if ( typeof selectionPivot === "undefined" || ( $( selectionPivot ).closest( "table" ).get( 0 ) !== $( this ).closest( "table" ).get( 0 ) ) ) {
							selectionPivot = $( this ).closest( "tr" );
							$( this ).closest( "tr" ).children( "td" ).addClass( "n-cell-selected" );
							return;
						}
						var bot = Math.min( selectionPivot[ 0 ].rowIndex, $( this ).closest( "tr" )[ 0 ].rowIndex );
						var top = Math.max( selectionPivot[ 0 ].rowIndex, $( this ).closest( "tr" )[ 0 ].rowIndex );
						for ( var i = bot; i <= top; i++ ) {
							$( trElements[ i ] ).children( "td" ).addClass( "n-cell-selected" );
						}
					}

					$( this ).attr( 'tabindex', 0 );
					$( this ).trigger( 'focus' );
					// Cell with input field
					$( this ).children().each( function() {
						if ( $( this ).is( 'input' ) && $( this ).attr( 'type' ) === 'text' ) {
							$( this ).trigger( 'focus' );
						}
					} );
				}
			} );

			$( '.n-sortable' ).on( 'click', function() {
				$( this ).find( '> span' ).each( function() {
					if ( $( this ).hasClass( 'icon-arrow' ) ) {
						$( this ).removeClass( 'icon-arrow' );
						$( this ).addClass( "icon-arrow-up" );
					} else if ( $( this ).hasClass( 'icon-arrow-up' ) ) {
						$( this ).removeClass( 'icon-arrow-up' );
						$( this ).addClass( "icon-arrow" );
					}
				} );
			} );

			$( '.n-table-scrollbar' ).on( 'hidden.bs.dropdown', '.selectlist', function() {
				synchronizeTableColumnWidth();
			} );
		} );

		$( window ).resize( function() {
			updateScrollTableWidth();
			synchronizeTableColumnWidth();
		} );

		function initTableScrollbar() {
			adjustScrollTable();
			hideInvisibleHead();
			setTimeout( synchronizeTableColumnWidth, 0 );
		}

		//insert and update some html code for every scroll table
		function adjustScrollTable() {
			$( ".n-table-scrollbar" ).each( function() {
				var colspanTotal = $( this ).closest( "table.n-table" ).find( "thead" ).eq( 0 ).find( "th" ).length;
				var theader = $( this ).closest( "table.n-table" ).find( "thead" ).eq( 0 ).html();
				var scrollTablePrefx = "<tr><th colspan='" + colspanTotal + "' style='padding: 0; border:none; border-bottom-left-radius: 7px; border-bottom-right-radius: 7px;'><table class='n-table-scrollbar'>" + theader;
				var scrollTableSuffix = "</table></th></tr>";
				var scrollTableHtml = $( this ).html();

				$( this ).html( scrollTablePrefx + scrollTableHtml + scrollTableSuffix );
				$( this ).removeClass( "n-table-scrollbar" );

				var scrollBody = $( this ).find( '.n-table-scrollbar' );
				var option = {};
				if ( $( this ).hasClass( 'scrollbar-not-autoupdate' ) ) {
					option = {
						notAutoUpdate: true
					};
				}
				packageScrollTable( scrollBody, option );
			} );
		}

		function packageScrollTable( scrollBody, option ) {
			scrollBody.nScrollbar( option );

			var tableWidth = scrollBody.closest( "table.n-table" ).width();
			var container = scrollBody.find( ".mCSB_container" );
			var containerPrefix = "<table style='width: " + tableWidth + "px;'>";
			var containerSuffix = "</table>";
			container.html( containerPrefix + container.html() + containerSuffix );

			/** Temproary solution -- Remove the border-radius for mCustomScrollBox because of IE' bug.
			 *
			 * Refer to: https://connect.microsoft.com/IE/feedback/details/809779/ie9-ie10-position-fixed-child-disappears-when-inside-a-parent-with-position-border-radius-and-overflow-hidden
			 * Refer to: http://stackoverflow.com/questions/20213286/ie10-border-radius-overflow-position-and-hidden-positionfixed-child
			 * **/
			var ua = navigator.userAgent;
			var M = ua.match( /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i ) || [];
			if ( /trident/i.test( M[ 1 ] ) ) {
				scrollBody.find( '.mCustomScrollBox' ).css( 'border-radius', '0' );
			}
		}

		function updateScrollTableWidth() {
			$( ".n-table-scrollbar" ).each( function() {
				var tableWidth = $( this ).closest( "table.n-table" ).width();
				var table = $( this ).find( ".mCSB_container table" );

				$( this ).find( ".mCSB_container table" ).each( function() {
					if ( !$( this ).hasClass( 'datepicker-calendar-days' ) ) {
						$( this ).width( tableWidth );
					}
				} );
			} );
		}

		function hideInvisibleHead() {
			$( ".n-table-scrollbar" ).each( function() {
				var theadRowCount = $( this ).closest( "table.n-table" ).find( "thead" ).children().length;
				// Hide the thead in scroll content
				for ( var j = 0; j < theadRowCount; j++ ) {
					/*jshint loopfunc: true */
					$( this ).closest( "table.n-table" ).find( ".mCSB_container" ).find( 'tr' ).eq( j ).find( 'th' ).each( function() {
						$( this ).css( 'visibility', 'hidden' ).css( 'height', '0' ).css( 'line-height', '0' ).css( 'border-bottom', '0' );
						$( this ).find( 'span' ).css( 'display', 'none' );
						// For filter header in scroll content.
						$( this ).find( 'div' ).css( 'visibility', 'hidden' ).css( 'height', '0' )
							.css( 'padding-top', '0' ).css( 'padding-bottom', '0' ).css( 'margin-top', '0' ).css( 'margin-bottom', '0' )
							.css( 'border-top', '0' ).css( 'border-bottom', '0' );
						$( this ).find( 'input' ).css( 'visibility', 'hidden' ).css( 'height', '0' )
							.css( 'padding-top', '0' ).css( 'padding-bottom', '0' ).css( 'margin', '0' ).css( 'margin-bottom', '0' )
							.css( 'border-top', '0' ).css( 'border-bottom', '0' );
						$( this ).find( 'button' ).css( 'visibility', 'hidden' ).css( 'height', '0' )
							.css( 'padding-top', '0' ).css( 'padding-bottom', '0' ).css( 'margin', '0' ).css( 'margin-bottom', '0' )
							.css( 'border-top', '0' ).css( 'border-bottom', '0' );
					} );
				}
			} );
		}

		function synchronizeTableColumnWidth() {
			$( ".n-table-scrollbar" ).each( function() {
				var tableWidth = $( this ).closest( "table.n-table" ).width();
				// reset the widht of thead to fit tbody
				var theadCols = $( this ).closest( "table.n-table" ).find( "thead" ).eq( 0 ).find( "th" );
				var tbodyCols = $( this ).find( "tr" ).eq( 0 ).children();
				var sumColWidth = 0;
				var targetWidths = [];
				var i;
				for ( i = 0; i < tbodyCols.length; i++ ) {
					sumColWidth += parseFloat( $( tbodyCols[ i ] ).outerWidth() );
					var targetWidth = parseFloat( $( tbodyCols[ i ] ).width() );
					if ( i === tbodyCols.length - 1 && sumColWidth !== tableWidth ) {
						targetWidth = targetWidth + ( tableWidth - sumColWidth );
					}
					targetWidths.push( targetWidth );
				}
				for ( i = 0; i < tbodyCols.length; i++ ) {
					$( theadCols[ i ] ).width( targetWidths[ i ] );
					$( tbodyCols[ i ] ).width( targetWidths[ i ] );
				}
			} );
		}


		// TABLE KEYBOARD ACCESSIBILITY
		// ============================
		$( document ).on( 'keydown.wf.table.keyboard', '.n-table:not(.n-keyboard-off) tbody', $.wfKBTable.tableKeyboardHandler );

	} )( $ );


	//scrollbar.js
	( function( $ ) {

		var createE = function() {
			var e = jQuery( document.createElement( arguments[ 0 ] ) );

			if ( arguments.length > 1 ) {
				var args = Array.prototype.slice.call( arguments, 0 );
				args.shift();

				if ( typeof args[ 0 ] === 'string' ) {
					e.addClass( args.shift() );
				}

				for ( var i = 0; i < args.length; i++ ) {
					if ( args[ i ] ) {
						//if (!args[i].jquery && typeof args[i].length !== "undefined") {
						//    args[i].forEach(function (_e) {
						//        e.append(_e);
						//    });
						//}
						//else {
						//    e.append(args[i]);
						//}
						e.append( args[ i ] );
					}
				}
			}

			return e;
		};

		var fonts_done = false;
		var font_ready_listeners = [];

		var Scrollbar = function( $container, axis ) {
			this.$container = $container;
			this.$content_container = $container.find( '.scrolling-content-container' );
			this.$content = $container.find( '.scrolling-content' );

			// Create the track and thumb
			this.$scrollbar = createE( 'div', 'scrollbar-container ' + axis,
				createE( 'div', 'track', createE( 'div' ) ),
				createE( 'div', 'thumb' )
			).appendTo( $container );
			this.$track = this.$scrollbar.find( '.track' );
			this.$thumb = this.$scrollbar.find( '.thumb' );
			this.$document = $( document );

			this.axis = this.axes[ axis ];

			this.content_offset = 0;
			this.max_content_offset = 0;
			this.max_thumb_offset = 0;
			this.thumb_size = ( this.container_size() / this.content_size() ) * this.container_size();
			this.$thumb.css( this.axis.track_size_property, this.thumb_size );
			//this.thumb_size = this.$thumb[this.axis.track_size_property]();
			this.drag_position = {
				thumb_start: null,
				mouse_start: null
			};

			this._drag_start = this.drag_start.bind( this );
			this._drag_move = this.drag_move.bind( this );
			this._drag_end = this.drag_end.bind( this );

			// Scroll when the thumb is dragged
			this.$thumb
				.bind( 'mousedown', this._drag_start )
				.bind( 'touchstart', this._drag_start );

			// Jump scroll position when the track is clicked
			this.$track
				.click( this.jump_to.bind( this ) );

			// Respond to mousewheel events
			this._mousewheel = this.mousewheel.bind( this );

			var container_elm = this.$container.get( 0 );

			if ( container_elm.addEventListener ) {
				container_elm.addEventListener( 'DOMMouseScroll', this._mousewheel, false );
				container_elm.addEventListener( 'mousewheel', this._mousewheel, false );
			} else {
				container_elm.onmousewheel = this._mousewheel;
			}

			// We set up the sizes twice. Once when fonts may not be ready and once after
			// to avoid a flash of the scollable content outside it's scrolling container
			this.size_changed();

			// Watch for changes in content size
			this.$content.bind( 'resize', this.size_changed.bind( this ) );
			// Watch for changes in container size
			this.$container.bind( 'resize', this.size_changed.bind( this ) );
		};

		Scrollbar.prototype = {
			// Functionality for a scrollbar is pretty much the same
			// whether it's vertical or horizontal but the way we
			// get some properties is different.
			axes: {
				'horizontal': {
					name: 'horizontal',
					dimension: 'x',
					container_size: function() {
						return this.$container.innerWidth();
					},
					content_container_size: function() {
						return this.$container.width();
					},
					content_size: function() {
						return this.$content.outerWidth();
					},
					track_margin: function() {
						return ( parseInt( this.$scrollbar.css( 'margin-left' ) ) || 0 ) +
							( parseInt( this.$scrollbar.css( 'margin-right' ) ) || 0 );
					},
					track_size_property: 'width',
					position_property: 'left',
					page_position: 'pageX',
					wheel_delta: 'wheelDeltaX'
				},
				'vertical': {
					name: 'vertical',
					dimension: 'y',
					container_size: function() {
						return this.$container.innerHeight();
					},
					content_container_size: function() {
						return this.$container.height();
					},
					content_size: function() {
						return this.$content_container.get( 0 ).scrollHeight;
					},
					track_margin: function() {
						return ( parseInt( this.$scrollbar.css( 'margin-top' ) ) || 0 ) +
							( parseInt( this.$scrollbar.css( 'margin-bottom' ) ) || 0 );
					},
					track_size_property: 'height',
					position_property: 'top',
					page_position: 'pageY',
					wheel_delta: 'wheelDeltaY'
				}
			},

			animation_duration: 250,

			container_size: function() {
				return this.axis.container_size.call( this );
			},

			content_container_size: function() {
				return this.axis.content_container_size.call( this );
			},

			content_size: function() {
				return this.axis.content_size.call( this );
			},

			track_margin: function() {
				return this.axis.track_margin.call( this );
			},

			size_changed: function() {
				if ( this.$container.is( ':visible' ) ) {
					this.$content_container.css( {
						width: this.$container.width(),
						height: this.$container.height()
					} );
				}

				var container_size = this.container_size();
				var content_container_size = this.content_container_size();
				var content_size = this.content_size();
				var track_margin = this.track_margin();

				if ( !container_size || !content_size || !content_container_size ) {
					return;
				}

				if ( content_size <= content_container_size ) {
					this.$container.removeClass( 'scrollbars-' + this.axis.name + '-visible' );
					this.set_position( 0 );
				} else {
					this.$container.addClass( 'scrollbars-' + this.axis.name + '-visible' );
					this.$scrollbar.css( this.axis.track_size_property, container_size - track_margin + 'px' );
					this.max_content_offset = -1 * ( content_size - content_container_size );
					this.max_thumb_offset = container_size - this.thumb_size - track_margin;

					// If we're scrolled and the size changes we need to change our offset
					if ( this.content_offset < this.max_content_offset ) {
						this.set_position( this.max_content_offset );
					}
				}

				this.onsizechange();
			},

			onsizechange: function() {

			},

			set_position: function( new_offset, animated ) {
				new_offset = parseInt( new_offset );

				if ( this.content_offset === new_offset ) {
					return;
				}

				this.content_offset = parseInt( Math.max( this.max_content_offset, Math.min( new_offset, 0 ) ) );
				var ratio = this.content_offset / this.max_content_offset;

				if ( animated ) {
					var options = {};
					options[ this.axis.position_property ] = this.content_offset;
					this.$content.animate( options, 250 );

					options = {};
					options[ this.axis.position_property ] = parseInt( this.max_thumb_offset * ratio );
					this.$thumb.animate( options, 250 );
				} else {
					this.$content.css( this.axis.position_property, this.content_offset );
					this.$thumb.css( this.axis.position_property, parseInt( this.max_thumb_offset * ratio ) );
				}

				this.onpositionchange( this.content_offset, animated );
				this.$container.trigger( 'scroll-position-changed' );
				$( document ).trigger( 'nsnscroll', this.$container.get( 0 ) );
			},

			// A hook for scroll changes
			onpositionchange: function( content_offset, animated ) {},

			drag_start: function( e ) {
				e.preventDefault();
				e.stopPropagation();

				if ( !this.$scrollbar.is( ':visible' ) ) {
					return;
				}

				this.drag_position.mouse_start = e[ this.axis.page_position ];
				this.drag_position.thumb_start = parseInt( this.$thumb.css( this.axis.position_property ) );

				this.$document.bind( 'mousemove', this._drag_move );
				this.$document.bind( 'mouseup', this._drag_end );
				this.$document.bind( 'touchmove', this._drag_move );
				this.$document.bind( 'touchend', this._drag_end );

				this.$container.trigger( 'scroll-start' );
			},

			drag_move: function( e ) {
				e.preventDefault();
				e.stopPropagation();
				var thumb_offset = this.drag_position.thumb_start + ( e[ this.axis.page_position ] - this.drag_position.mouse_start );
				var new_content_offset = Math.min( this.max_thumb_offset, thumb_offset ) / this.max_thumb_offset * this.max_content_offset;
				this.set_position( new_content_offset );

				this.$container.trigger( 'scroll-move' );
			},

			drag_end: function( e ) {
				this.$document.unbind( 'mousemove', this._drag_move );
				this.$document.unbind( 'mouseup', this._drag_end );
				this.$document.unbind( 'touchmove', this._drag_move );
				this.$document.unbind( 'touchend', this._drag_end );

				this.drag_position.thumb_start = null;
				this.drag_position.mouse_start = null;

				this.$container.trigger( 'scroll-end' );
			},

			jump_to: function( e ) {
				var thumb_offset = e[ this.axis.page_position ] - this.$track.offset()[ this.axis.position_property ] - this.thumb_size / 2;
				var new_content_offset = parseInt( Math.min( this.max_thumb_offset, thumb_offset ) / this.max_thumb_offset * this.max_content_offset );
				this.set_position( new_content_offset );
			},

			smooth_to: function( pos ) {
				var new_offset = Math.min( Math.max( pos, this.max_content_offset ), 0 );
				this.set_position( pos, true );
			},

			mousewheel: function( event ) {
				if ( !this.$scrollbar.is( ':visible' ) ) {
					return;
				}

				var delta = 0,
					e = event || window.event;

				if ( typeof e.wheelDeltaX === 'undefined' && typeof e.wheelDelta !== "undefined" ) {
					e.wheelDeltaX = e.wheelDeltaY = e.wheelDelta;
				}

				if ( typeof e.wheelDelta !== "undefined" ) {
					delta = e[ this.axis.wheel_delta ] / 120;
				} else if ( e.detail ) {
					delta = -e.detail / 3;
				}

				this.set_position( this.content_offset + delta * 40 );

				e = $.event.fix( e );
				e.preventDefault();

				this.$container.trigger( 'scroll-move' );
			}
		};

		var old = $.fn.scrollbars;

		function Plugin() {
			return $( this ).each( function() {
				var $container = $( this );

				var options = {
					horizontal: $container.is( '.horizontal' ),
					vertical: $container.is( '.vertical' )
				};

				$container.wrapInner( createE( 'div', 'scrolling-content-container', createE( 'div', 'scrolling-content' ) ) );
				var scrollbars = [];

				[ 'horizontal', 'vertical' ].forEach( function( axis ) {
					if ( options[ axis ] && typeof $container.data( 'scrollbar-' + axis ) === "undefined" ) {
						var scrollbar = new Scrollbar( $container, axis );
						scrollbars.push( scrollbar );
						$container.data( 'scrollbar-' + axis, scrollbar );
					}
				} );
			} );
		}

		$.fn.scrollbars = Plugin;
		$.fn.scrollbars.Constructor = Scrollbar;

		$.fn.scrollbars.noConflict = function() {
			$.fn.scrollbars = old;
			return this;
		};

		$( document ).ready( function() {
			//$('.scrollbars').scrollbars();
		} );

	} )( $ );


	//flyout.js
	( function( $ ) {

		$( function() {
			$( '[data-markup^="flyout"]' ).each( function() {
				var $flyout = $( this );
				var $container = $flyout.find( ".n-flyout-container" );
				var contaierWidth = $container.outerWidth();
				var containerHeight = $container.outerHeight();
				var direction = $flyout.data( 'direction' );

				switch ( direction ) {
					case 'top':
						$flyout.css( "bottom", ( -containerHeight ) + "px" );
						break;
					case 'bottom':
						$flyout.css( "top", ( -containerHeight ) + "px" );
						break;
					case 'left':
						$flyout.css( "right", ( -contaierWidth ) + "px" );
						break;
					case 'right':
						$flyout.css( "left", ( -contaierWidth ) + "px" );
						var $openAnchor = $flyout.find( ".n-flyout-open" );
						var openHeight = $openAnchor.outerHeight();
						$openAnchor.css( "left", ( contaierWidth + 1 ) + "px" );
						$openAnchor.css( "top", Math.ceil( ( containerHeight - openHeight ) / 2 ) + "px" );
						break;
				}

				// Generate the scroll content (if there is) before container hide.
				$( '.scrollbars' ).scrollbars();
				$container.hide();

				$flyout.find( 'ul li' ).eq( 0 ).addClass( 'selected' );
				$flyout.find( 'ul li' ).eq( 1 ).addClass( 'after-selected' );
			} );
		} );

		$( document ).on( 'click.wf.flyout', '.n-flyout .n-flyout-open', HandleFlyoutOpen )
			.on( 'keydown.wf.flyout.keyboard', '.n-flyout-menu', $.wfKBCore.commonKeyboardHandler );

		$( 'body' ).click( function( e ) {
			if ( $( e.target ).closest( '.n-flyout' ).length === 0 ) {
				var $flyout = $( '.n-flyout' );
				var container = $flyout.find( '.n-flyout-container' );
				if ( container.is( ':visible' ) ) {
					var direction = $flyout.data( 'direction' );
					hideFlyout( $flyout, direction );
				}
			}
		} );

		$( '.n-flyout' ).on( 'keydown', '*:focus', function( event ) {
			if ( event.keyCode === 27 ) {
				var $flyout = $( this ).parents( '.n-flyout' );
				var direction = $flyout.data( 'direction' );
				hideFlyout( $flyout, direction );
			}
		} );

		function HandleFlyoutOpen( event ) {
			var $clickTarget = $( event.target );
			var $openAnchor = $( this );
			var $flyout = $openAnchor.parent();
			var $container = $flyout.find( '.n-flyout-container' );
			var direction = $flyout.data( 'direction' );

			if ( $openAnchor.hasClass( 'n-drawer-tabs' ) ) {
				if ( $container.is( ':visible' ) ) {
					if ( $clickTarget.closest( 'li' ).hasClass( 'selected' ) ) {
						hideFlyout( $flyout, direction );
					}
				} else {
					showFlyout( $flyout, direction );
				}
			} else {
				if ( $container.is( ':visible' ) ) {
					hideFlyout( $flyout, direction );
				} else {
					showFlyout( $flyout, direction );
				}
			}
		}

		function hideFlyout( $flyout, direction ) {
			var $container = $flyout.find( '.n-flyout-container' );
			var menuHeight = $container.outerHeight();
			var menuWidth = $container.outerWidth();
			switch ( direction ) {
				case 'top':
					$container.parent( ".n-flyout" ).animate( {
						bottom: -menuHeight
					}, 400, function() {
						$container.hide();
					} );
					break;
				case 'bottom':
					$container.parent( ".n-flyout" ).animate( {
						top: -menuHeight
					}, 400, function() {
						$container.hide();
					} );
					break;
				case 'left':
					$container.parent( ".n-flyout" ).animate( {
						right: -menuWidth
					}, 400, function() {
						$container.hide();
					} );
					break;
				case 'right':
					$container.parent( ".n-flyout" ).animate( {
						left: -menuWidth
					}, 400, function() {
						$container.hide();
					} );
					break;
			}
			$flyout.attr( 'data-expand', 'false' );

			if ( $flyout.hasClass( 'n-drawer' ) ) {
				$flyout.find( '.drawer-toggle-down' ).removeClass( 'drawer-toggle-down' ).addClass( 'drawer-toggle-up' );
				$flyout.find( '.drawer-shadow' ).fadeOut( 400 );
			}
		}

		function showFlyout( $flyout, direction ) {
			var $container = $flyout.find( '.n-flyout-container' );
			$container.show();
			switch ( direction ) {
				case 'top':
					$container.parent( ".n-flyout" ).animate( {
						bottom: 0
					}, 400 );
					break;
				case 'bottom':
					$container.parent( ".n-flyout" ).animate( {
						top: 0
					}, 400 );
					break;
				case 'left':
					$container.parent( ".n-flyout" ).animate( {
						right: 0
					}, 400 );
					break;
				case 'right':
					$container.parent( ".n-flyout" ).animate( {
						left: 0
					}, 400 );
					break;
			}
			$flyout.attr( 'data-expand', 'true' );

			if ( $flyout.hasClass( 'n-taskpad' ) ) {
				$container.find( ".n-search-input" ).focus();
			} else if ( $flyout.hasClass( 'n-drawer' ) ) {
				$flyout.find( '.drawer-toggle-up' ).removeClass( 'drawer-toggle-up' ).addClass( 'drawer-toggle-down' );
				$flyout.find( '.drawer-shadow' ).fadeIn( 400 );
			} else {
				$container.find( "a:first" ).focus();
			}
		}

	} )( $ );


	//inputfield.js
	( function( $ ) {

		// INPUTFIELD PUBLIC CLASS DEFINITION
		// ======================
		var InputField = function( element, options ) {};

		InputField.VERSION = '1.1.0';

		InputField.prototype.constructor = InputField;

		InputField.prototype.clearContent = function() {
			var prev = $( this ).prev();
			if ( prev.hasClass( "n-inputfield" ) ) {
				if ( !prev.hasClass( "n-search-input" ) ) {
					$( this ).hide();
				}
				prev.val( "" );
				prev.attr( "placeholder", "" );
				prev.focus();
			}
		};

		// INPUTFIELD INTERNAL METHODS
		// ========================
		function detectMandatory( event ) {
			var inputValue = event.target.value;
			var mandatoryElement = $( event.target ).next( ".form-control-feedback" ).find( ".icon" );

			if ( inputValue.length > 0 ) {
				mandatoryElement.removeClass( "icon-mandatory" );
			} else {
				mandatoryElement.addClass( "icon-mandatory" );
			}
		}

		function showClearIcon( event ) {
			var inputValue = event.target.value;
			var controlIcon = $( event.target ).next( '.n-inputfield-control-icon' );
			if ( inputValue.length > 0 ) {
				controlIcon.show();
			} else {
				controlIcon.hide();
			}
		}

		function bindOnblurForClearableInputField() {
			$( '.n-inputfield-clearable input' ).each( function() {
				var placeholderText = $( this ).attr( "placeholder" );
				$( this ).on( 'blur', function() {
					$( this ).attr( 'placeholder', placeholderText );
				} );
			} );
		}

		function handleForgetPwd( event ) {
			$( event.target ).removeClass( "n-link-visited" ).addClass( "n-link-visited" );
		}

		function handleLoginbutton( event ) {
			var isEmpty = false;
			$( event.target ).closest( '.n-login-textfields' ).find( '.n-inputfield' ).each( function() {
				if ( !$( this ).val() ) {
					isEmpty = true;
					return false;
				}
			} );
			var $login = $( event.target ).closest( '.n-login' ).find( '.n-login-action button' );
			if ( isEmpty ) {
				$login.prop( 'disabled', true );
			} else {
				$login.prop( 'disabled', false );
			}
		}

		// INPUTFIELD PLUGIN DEFINITION
		// =========================

		function Plugin( option ) {
			return this.each( function() {
				var $this = $( this );
				var data = $this.data( 'wf.inputfield' );
				var options = typeof option === 'object' && option;

				if ( !data && /destroy|hide/.test( option ) ) {
					return;
				}
				if ( !data ) {
					$this.data( 'wf.inputfield', ( data = new InputField( this, options ) ) );
				}
				if ( typeof option === 'string' ) {
					data[ option ]();
				}
			} );
		}

		var old = $.fn.nInputField;

		$.fn.nInputField = Plugin;
		$.fn.nInputField.Constructor = InputField;


		// INPUTFIELD NO CONFLICT
		// ===================

		$.fn.nInputField.noConflict = function() {
			$.fn.nInputField = old;
			return this;
		};

		$( document )
			.on( 'keyup.wf.forms', '.input-required input', detectMandatory )
			.on( 'keyup.wf.forms', '.n-inputfield-clearable input', showClearIcon )
			.on( 'click.wf.forms', '.n-inputfield-clearable .n-inputfield-control-icon', InputField.prototype.clearContent )
			.on( 'click.wf.forms', '.n-login-forget-password > a', handleForgetPwd )
			.on( 'keyup.wf.forms change.wulf.forms', '.n-login .n-inputfield', handleLoginbutton )
			.on( 'keydown.wf.forms.keyboard', '[class$="-clearable"] a', $.wfKBCore.commonKeyboardHandler );

		$( document ).ready( function() {
			bindOnblurForClearableInputField();
		} );

	} )( $ );


	//spinner.js
	( function( $ ) {

		// SPINNER EYBOARD ACCESSIBILITY METHODS DEFINITION
		// ================================================
		var SPACE_BAR_KEY = 32;
		var UP_KEY = 38;
		var DOWN_KEY = 40;

		function spinnerKeyboardHandler( e ) {
			var supportKeys = [ SPACE_BAR_KEY, UP_KEY, DOWN_KEY ];
			var key = e.keyCode;

			if ( supportKeys.indexOf( key ) === -1 ) {
				return;
			}

			if ( key === SPACE_BAR_KEY ) {
				$( e.target ).trigger( 'mousedown' );
				$( e.target ).trigger( 'mouseup' );
			} else {
				e.preventDefault();
				e.stopPropagation();
			}
		}

		$( document )
			.on( 'keydown.wf.spinner.keyboard', '.spinbox .spinbox-up', spinnerKeyboardHandler )
			.on( 'keydown.wf.spinner.keyboard', '.spinbox .spinbox-down', spinnerKeyboardHandler );

	} )( $ );


	//balloon.js
	( function( $ ) {

		// BALLOON PUBLIC CLASS DEFINITION
		// ======================
		var Balloon = function( element, options ) {
			this.element = element;

			// Build content for balloon with close icon
			if ( $( element ).hasClass( 'balloon-icon' ) ) {
				options = $.extend( {}, options, {
					html: true,
					content: function() {
						return $( $( element ).data( 'target-selector' ) ).html();
					}
				} );
			}

			// For hover balloon
			if ( $( element ).hasClass( 'n-hover-balloon' ) ) {
				options = $.extend( {}, options, {
					trigger: 'click hover'
				} );
			}

			// Init balloon component
			this.init( 'balloon', element, options );

			// Bind close icon event
			$( element ).on( 'shown.bs.balloon', function() {
				var $popover = $( this );
				$popover.parent().find( '.n-close' ).on( 'click', function() {
					$popover.data( 'bs.balloon' ).hide();
				} );
			} );
		};

		if ( !$.fn.popover ) {
			throw new Error( 'Balloon requires Bootstrap popover.js' );
		}

		Balloon.VERSION = '1.1.0';

		// NOTE: BALLOON EXTENDS popover.js
		// ================================
		Balloon.prototype = $.extend( {}, $.fn.popover.Constructor.prototype );

		Balloon.prototype.constructor = Balloon;

		// Extends popover.toggle method
		( function( toggle ) {
			Balloon.prototype.toggle = function() {
				// call original method
				toggle.call( this );

				// add extended logic -- close other opened balloon
				var element = this.element;
				$( '[data-toggle^="balloon"]' ).each( function( idx, el ) {
					if ( element !== el ) {
						$( this ).data( 'bs.balloon' ).hide();
					}
					$( this ).parent().tooltip( 'hide' );
				} );

			};
		}( $.fn.popover.Constructor.prototype.toggle ) );

		Balloon.prototype.fadeout = function() {
			var $balloon = $( this );
			var $tip = $balloon.data( 'bs.balloon' ).tip();
			setTimeout( function() {
				if ( $tip.hasClass( 'in' ) ) {
					$tip.fadeOut( 1000, function() {
						$balloon.data( 'bs.balloon' ).hide();
					} );
				}
			}, 1000 );
		};

		// BALLOON PLUGIN DEFINITION
		// =========================

		function Plugin( option ) {
			return this.each( function() {
				var $this = $( this );
				var data = $this.data( 'bs.balloon' );
				var options = typeof option === 'object' && option;

				if ( !data && /destroy|hide/.test( option ) ) {
					return;
				}
				if ( !data ) {
					$this.data( 'bs.balloon', ( data = new Balloon( this, options ) ) );
				}
				if ( typeof option === 'string' ) {
					data[ option ]();
				}
			} );
		}

		var old = $.fn.nBalloon;

		$.fn.nBalloon = Plugin;
		$.fn.nBalloon.Constructor = Balloon;


		// BALLOON NO CONFLICT
		// ===================

		$.fn.nBalloon.noConflict = function() {
			$.fn.nBalloon = old;
			return this;
		};

		// BALLOON INTERNAL METHODS
		// ========================
		var restore = function() {
			$( '[data-toggle^="balloon"]' ).each( function() {
				var $balloon = $( this ).data( 'bs.balloon' );
				var $tip = $balloon.tip();
				if ( $tip.hasClass( 'in' ) ) {
					$balloon.show();
				}
			} );
		};

		$( document )
			.on( 'shown.bs.balloon', '[data-toggle="balloon"][class~="fadeout"]', Balloon.prototype.fadeout )
			.on( 'keydown.wf.balloon.keyboard', 'a[data-toggle=balloon]', $.wfKBCore.commonKeyboardHandler );

		// TODO:Jonathan, the resize events should be throttled.
		$( window ).on( 'resize', restore );


	} )( $ );


	//buttons.js
	( function( $ ) {

		// BUTTONS INTERNAL METHODS
		// ========================

		var selectTabButton = function() {
			$( this ).siblings( '.selected' ).removeClass( 'selected' );
			$( this ).addClass( 'selected' );
		};

		var handleEnterKeyInToggleButton = function( e ) {
			if ( e.keyCode === 13 ) {
				e.preventDefault();
				$( e.target ).trigger( 'click' );
			}
		};

		$( document )
			.on( 'click.wf.buttons', '.btn-group.n-tab-buttons .btn', selectTabButton )
			.on( 'keydown.wf.buttons.keyboard', '.n-toggle-switch-input', handleEnterKeyInToggleButton );


	} )( $ );


	//calendar.js
	( function( $ ) {

		var classNoRadiusLb = 'n-inputfield-nonradius-lb';

		if ( typeof $.fn.datepicker !== "function" ) {
			return;
		}

		$( document )
			.on( 'shown.bs.dropdown hidden.bs.dropdown', '.n-calendar', function() {
				$( this ).children( 'input' ).toggleClass( classNoRadiusLb );
			} )
			.on( 'blur.wf.calendar', '.n-calendar input', function() {
				var $input = $( this );
				$input.next().find( ".dropdown-toggle" ).attr( "aria-expanded", "false" );
				if ( $input.hasClass( classNoRadiusLb ) ) {
					$input.removeClass( classNoRadiusLb );
				}
			} )
			//down key will result the focus to the back button
			.on( 'keydown.wf.calendar', '.n-calendar .datepicker-wheels-year', focusToWheelsBack )
			.on( 'keydown.wf.calendar', '.n-calendar .datepicker-wheels-month', focusToWheelsBack )
			//the focus will be switched to the title after clicking on back or select button.
			.on( 'click.wf.calendar', '.datepicker-wheels-footer .datepicker-wheels-back', focusToHeaderTitle )
			.on( 'click.wf.calendar', '.datepicker-wheels-footer .datepicker-wheels-select', focusToHeaderTitle )
			.on( 'shown.bs.dropdown', '.n-calendar .input-group-btn', onDatePickerExpand )
			.on( 'scroll.wf.calendar', closeDatePickerOnScroll )
			.on( 'changed.fu.datepicker', '.datepicker', updateTimer )
			.on( 'click.wf.calendar', '.n-calendar-lock-past button', DisablePastDays )
			.on( 'click.fu.datepicker', '.datepicker-calendar tr td', onDateBoxClicked );

		$( window ).on( 'resize.wf.calendar', function() {
			closeDatePickerOnScroll();
			$( '.n-calendar' ).each( function() {
				var input = $( this ).find( 'input' );
				if ( input.data( 'position' ) !== 'fixed' ) {
					relocateDatePicker( $( this ) );
				}
			} );
		} );

		function onDateBoxClicked( e ) {
			var $btn = $( e.currentTarget ).find( 'button' )[ 0 ];
			if ( e.target !== $btn && $( $btn ).closest( 'span' ).css( 'display' ) !== 'none' ) {
				$btn.click();
			}
		}

		function focusToWheelsBack( evt ) {
			if ( evt.which === 40 ) {
				/*jshint validthis:true */
				$( this ).nextAll( '.datepicker-wheels-footer' ).find( '.datepicker-wheels-back' ).focus();
				evt.preventDefault();
				evt.stopPropagation();
			}
		}

		function focusToHeaderTitle( evt ) {
			/*jshint validthis:true */
			$( this ).closest( '.datepicker-calendar-wrapper' ).find( 'button.title' ).focus();
			evt.preventDefault();
			evt.stopPropagation();
		}

		function onDatePickerExpand() {
			/*jshint validthis:true */
			relocateDatePicker( $( this ).closest( '.n-calendar' ) );
		}

		function relocateDatePicker( nCalendar ) {
			var wrap = nCalendar.find( '.datepicker-calendar-wrapper' );
			var wrapExcess = wrap.outerWidth() - nCalendar.width();
			if ( nCalendar.find( 'input' ).data( 'position' ) === 'fixed' ) {
				if ( wrap.length !== 0 ) {
					wrap.css( 'position', 'fixed' );
					wrap.css( 'top', nCalendar.offset().top + nCalendar.height() - $( document ).scrollTop() );
					var leftPos = nCalendar.offset().left - wrap.outerWidth() + nCalendar.width() - $( document ).scrollLeft();
					if ( leftPos < 0 ) { //move to right side if clipped on left side
						leftPos += wrapExcess;
					}
					wrap.css( 'left', leftPos );
					wrap.css( 'right', 'auto' );
				}
			} else {
				//move to right side if clipped on left side
				if ( wrapExcess > nCalendar.offset().left ) {
					wrap.css( 'right', -wrapExcess );
				} else {
					wrap.css( 'right', 0 );
				}
			}
		}

		function closeDatePickerOnScroll() {
			$( '.datepicker-calendar-wrapper' ).each( function() {
				if ( $( this ).css( 'display' ) === 'block' ) {
					var input = $( this ).closest( '.n-calendar' ).find( 'input' );
					if ( input.data( 'position' ) === 'fixed' ) {
						$( this ).parent().find( 'button.dropdown-toggle' ).trigger( 'click' );
					}
				}
			} );
		}

		//Data-API for data-markup=calendar, HTML markup will be generated automatically
		$( function() {
			$( '[data-markup^="calendar"]' ).each( function() {
				if ( $( this ).parent().find( '.datepicker-calendar-wrapper' ).length === 0 ) {
					$( this ).after( '<div class=\"input-group-btn\"><button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\">  <span class=\"glyphicon glyphicon-calendar\"></span>  <span class=\"sr-only\">Toggle Calendar</span></button><div class=\"dropdown-menu dropdown-menu-right datepicker-calendar-wrapper\" role=\"menu\">  <div class=\"datepicker-calendar\"><div class=\"datepicker-calendar-header\"><button type=\"button\" class=\"prev\"><span class=\"glyphicon glyphicon-chevron-left\"></span><span class=\"sr-only\">Previous Month</span></button><button type=\"button\" class=\"next\"><span class=\"glyphicon glyphicon-chevron-right\"></span><span class=\"sr-only\">Next Month</span></button><button type=\"button\" class=\"title\"><span class=\"month\">  <span data-month=\"0\">January</span>  <span data-month=\"1\">February</span>  <span data-month=\"2\">March</span>  <span data-month=\"3\">April</span>  <span data-month=\"4\">May</span>  <span data-month=\"5\">June</span>  <span data-month=\"6\">July</span>  <span data-month=\"7\">August</span>  <span data-month=\"8\">September</span>  <span data-month=\"9\">October</span>  <span data-month=\"10\">November</span>  <span data-month=\"11\">December</span></span> <span class=\"year\"></span></button></div><table class=\"datepicker-calendar-days\"><thead><tr><th>SUN</th><th>MON</th><th>TUE</th><th>WED</th><th>THU</th><th>FRI</th><th>SAT</th></tr></thead><tbody></tbody></table></div><div class=\"datepicker-wheels\" aria-hidden=\"true\"><div class=\"datepicker-wheels-month\"><h2 class=\"header\">Month</h2><ul><li data-month=\"0\"><button type=\"button\">Jan</button></li><li data-month=\"1\"><button type=\"button\">Feb</button></li><li data-month=\"2\"><button type=\"button\">Mar</button></li><li data-month=\"3\"><button type=\"button\">Apr</button></li><li data-month=\"4\"><button type=\"button\">May</button></li><li data-month=\"5\"><button type=\"button\">Jun</button></li><li data-month=\"6\"><button type=\"button\">Jul</button></li><li data-month=\"7\"><button type=\"button\">Aug</button></li><li data-month=\"8\"><button type=\"button\">Sep</button></li><li data-month=\"9\"><button type=\"button\">Oct</button></li><li data-month=\"10\"><button type=\"button\">Nov</button></li><li data-month=\"11\"><button type=\"button\">Dec</button></li></ul></div><div class=\"datepicker-wheels-year\"><h2 class=\"header\">Year</h2><ul></ul></div><div class=\"datepicker-wheels-footer clearfix\"><button type=\"button\" class=\"btn datepicker-wheels-back\"><span class=\"icon icon-left\"></span><span class=\"sr-only\">Return to Calendar</span></button><button type=\"button\" class=\"btn datepicker-wheels-select\">Select <span class=\"sr-only\">Month and Year</span></button></div></div></div></div> </div></div>' );
				}
			} );

			$( '[data-markup^="disabled_calendar"]' ).each( function() {
				if ( $( this ).parent().find( '.datepicker-calendar-wrapper' ).length === 0 ) {
					$( this ).after( '<div class=\"input-group-btn\"><button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" disabled>  <span class=\"glyphicon glyphicon-calendar\"></span>  <span class=\"sr-only\">Toggle Calendar</span></button><div class=\"dropdown-menu dropdown-menu-right datepicker-calendar-wrapper\" role=\"menu\">  <div class=\"datepicker-calendar\"><div class=\"datepicker-calendar-header\"><button type=\"button\" class=\"prev\"><span class=\"glyphicon glyphicon-chevron-left\"></span><span class=\"sr-only\">Previous Month</span></button><button type=\"button\" class=\"next\"><span class=\"glyphicon glyphicon-chevron-right\"></span><span class=\"sr-only\">Next Month</span></button><button type=\"button\" class=\"title\"><span class=\"month\">  <span data-month=\"0\">January</span>  <span data-month=\"1\">February</span>  <span data-month=\"2\">March</span>  <span data-month=\"3\">April</span>  <span data-month=\"4\">May</span>  <span data-month=\"5\">June</span>  <span data-month=\"6\">July</span>  <span data-month=\"7\">August</span>  <span data-month=\"8\">September</span>  <span data-month=\"9\">October</span>  <span data-month=\"10\">November</span>  <span data-month=\"11\">December</span></span> <span class=\"year\"></span></button></div><table class=\"datepicker-calendar-days\"><thead><tr><th>SUN</th><th>MON</th><th>TUE</th><th>WED</th><th>THU</th><th>FRI</th><th>SAT</th></tr></thead><tbody></tbody></table></div><div class=\"datepicker-wheels\" aria-hidden=\"true\"><div class=\"datepicker-wheels-month\"><h2 class=\"header\">Month</h2><ul><li data-month=\"0\"><button type=\"button\">Jan</button></li><li data-month=\"1\"><button type=\"button\">Feb</button></li><li data-month=\"2\"><button type=\"button\">Mar</button></li><li data-month=\"3\"><button type=\"button\">Apr</button></li><li data-month=\"4\"><button type=\"button\">May</button></li><li data-month=\"5\"><button type=\"button\">Jun</button></li><li data-month=\"6\"><button type=\"button\">Jul</button></li><li data-month=\"7\"><button type=\"button\">Aug</button></li><li data-month=\"8\"><button type=\"button\">Sep</button></li><li data-month=\"9\"><button type=\"button\">Oct</button></li><li data-month=\"10\"><button type=\"button\">Nov</button></li><li data-month=\"11\"><button type=\"button\">Dec</button></li></ul></div><div class=\"datepicker-wheels-year\"><h2 class=\"header\">Year</h2><ul></ul></div><div class=\"datepicker-wheels-footer clearfix\"><button type=\"button\" class=\"btn datepicker-wheels-back\"><span class=\"icon icon-left\"></span><span class=\"sr-only\">Return to Calendar</span></button><button type=\"button\" class=\"btn datepicker-wheels-select\">Select <span class=\"sr-only\">Month and Year</span></button></div></div></div></div> </div></div>' );
				}
			} );

			$( '[data-markup^="timer_calendar"]' ).each( function() {
				if ( $( this ).parent().find( '.datepicker-calendar-wrapper' ).length === 0 ) {
					$( this ).after( '<div class=\"input-group-btn\"><button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\">  <span class=\"glyphicon glyphicon-calendar\"></span>  <span class=\"sr-only\">Toggle Calendar</span></button><div class=\"dropdown-menu dropdown-menu-right datepicker-calendar-wrapper\" role=\"menu\">  <div class=\"datepicker-calendar\"><div class=\"datepicker-calendar-header\"><button type=\"button\" class=\"prev\"><span class=\"glyphicon glyphicon-chevron-left\"></span><span class=\"sr-only\">Previous Month</span></button><button type=\"button\" class=\"next\"><span class=\"glyphicon glyphicon-chevron-right\"></span><span class=\"sr-only\">Next Month</span></button><button type=\"button\" class=\"title\"><span class=\"month\">  <span data-month=\"0\">January</span>  <span data-month=\"1\">February</span>  <span data-month=\"2\">March</span>  <span data-month=\"3\">April</span>  <span data-month=\"4\">May</span>  <span data-month=\"5\">June</span>  <span data-month=\"6\">July</span>  <span data-month=\"7\">August</span>  <span data-month=\"8\">September</span>  <span data-month=\"9\">October</span>  <span data-month=\"10\">November</span>  <span data-month=\"11\">December</span></span> <span class=\"year\"></span></button></div><table class=\"datepicker-calendar-days\"><thead><tr><th>SUN</th><th>MON</th><th>TUE</th><th>WED</th><th>THU</th><th>FRI</th><th>SAT</th></tr></thead><tbody></tbody></table><div class=\"datepicker-calendar-timer\"><div class=\"spinner-container datepicker-calendar-hour\"><div class=\"spinbox\" data-initialize=\"spinbox\"><input type=\"text\" class=\"form-control spinbox-input n-inputfield\"><div class=\"spinbox-buttons btn-group btn-group-vertical\"><button type=\"button\" class=\"btn btn-default spinbox-up btn-xs\"><span class=\"icon icon-arrow-up\"></span><span class=\"sr-only\">Increase</span></button><button type=\"button\" class=\"btn btn-default spinbox-down btn-xs\"><span class=\"icon icon-arrow\"></span><span class=\"sr-only\">Decrease</span></button></div></div></div><div class=\"spinner-container datepicker-calendar-minute\"><div class=\"spinbox\" data-initialize=\"spinbox\"><input type=\"text\" class=\"form-control spinbox-input n-inputfield\"><div class=\"spinbox-buttons btn-group btn-group-vertical\"><button type=\"button\" class=\"btn btn-default spinbox-up btn-xs\"><span class=\"icon icon-arrow-up\"></span><span class=\"sr-only\">Increase</span></button><button type=\"button\" class=\"btn btn-default spinbox-down btn-xs\"><span class=\"icon icon-arrow\"></span><span class=\"sr-only\">Decrease</span></button></div></div></div><div class=\"spinner-container datepicker-calendar-AMPM\"><div class=\"spinbox\" data-initialize=\"spinbox\"><input id=\"s-normal\" type=\"text\" tabIndex=\"-1\" class=\"form-control spinbox-input n-inputfield n-inputfield-uneditable\" readonly><div class=\"spinbox-buttons btn-group btn-group-vertical\"><button type=\"button\" class=\"btn btn-default spinbox-up btn-xs\"><span class=\"icon icon-arrow-up\"></span><span class=\"sr-only\">Increase</span></button><button type=\"button\" class=\"btn btn-default spinbox-down btn-xs\"><span class=\"icon icon-arrow\"></span><span class=\"sr-only\">Decrease</span></button></div></div><input type=\"text\" tabIndex=\"-1\" class=\"form-control spinbox-input n-inputfield ampm n-inputfield-uneditable\" readonly></div><div class=\"operator-btn\"><button type=\"button\" class=\"btn btn-small now\">Now</button> <button type=\"button\" class=\"btn btn-action btn-small done\">Done</button></div></div></div><div class=\"datepicker-wheels\" aria-hidden=\"true\"><div class=\"datepicker-wheels-month\"><h2 class=\"header\">Month</h2><ul><li data-month=\"0\"><button type=\"button\">Jan</button></li><li data-month=\"1\"><button type=\"button\">Feb</button></li><li data-month=\"2\"><button type=\"button\">Mar</button></li><li data-month=\"3\"><button type=\"button\">Apr</button></li><li data-month=\"4\"><button type=\"button\">May</button></li><li data-month=\"5\"><button type=\"button\">Jun</button></li><li data-month=\"6\"><button type=\"button\">Jul</button></li><li data-month=\"7\"><button type=\"button\">Aug</button></li><li data-month=\"8\"><button type=\"button\">Sep</button></li><li data-month=\"9\"><button type=\"button\">Oct</button></li><li data-month=\"10\"><button type=\"button\">Nov</button></li><li data-month=\"11\"><button type=\"button\">Dec</button></li></ul></div><div class=\"datepicker-wheels-year\"><h2 class=\"header\">Year</h2><ul></ul></div><div class=\"datepicker-wheels-footer clearfix\"><button type=\"button\" class=\"btn datepicker-wheels-back\"><span class=\"icon icon-left\"></span><span class=\"sr-only\">Return to Calendar</span></button><button type=\"button\" class=\"btn datepicker-wheels-select\">Select <span class=\"sr-only\">Month and Year</span></button></div></div></div></div> </div></div>' );
				}
			} );

			$( '[data-markup^="disabled_timer_calendar"]' ).each( function() {
				if ( $( this ).parent().find( '.datepicker-calendar-wrapper' ).length === 0 ) {
					$( this ).after( '<div class=\"input-group-btn\"><button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" disabled>  <span class=\"glyphicon glyphicon-calendar\"></span>  <span class=\"sr-only\">Toggle Calendar</span></button><div class=\"dropdown-menu dropdown-menu-right datepicker-calendar-wrapper\" role=\"menu\">  <div class=\"datepicker-calendar\"><div class=\"datepicker-calendar-header\"><button type=\"button\" class=\"prev\"><span class=\"glyphicon glyphicon-chevron-left\"></span><span class=\"sr-only\">Previous Month</span></button><button type=\"button\" class=\"next\"><span class=\"glyphicon glyphicon-chevron-right\"></span><span class=\"sr-only\">Next Month</span></button><button type=\"button\" class=\"title\"><span class=\"month\">  <span data-month=\"0\">January</span>  <span data-month=\"1\">February</span>  <span data-month=\"2\">March</span>  <span data-month=\"3\">April</span>  <span data-month=\"4\">May</span>  <span data-month=\"5\">June</span>  <span data-month=\"6\">July</span>  <span data-month=\"7\">August</span>  <span data-month=\"8\">September</span>  <span data-month=\"9\">October</span>  <span data-month=\"10\">November</span>  <span data-month=\"11\">December</span></span> <span class=\"year\"></span></button></div><table class=\"datepicker-calendar-days\"><thead><tr><th>SUN</th><th>MON</th><th>TUE</th><th>WED</th><th>THU</th><th>FRI</th><th>SAT</th></tr></thead><tbody></tbody></table><div class=\"datepicker-calendar-timer\"><div class=\"spinner-container datepicker-calendar-hour\"><div class=\"spinbox\" data-initialize=\"spinbox\"><input type=\"text\" class=\"form-control spinbox-input n-inputfield\"><div class=\"spinbox-buttons btn-group btn-group-vertical\"><button type=\"button\" class=\"btn btn-default spinbox-up btn-xs\"><span class=\"icon icon-arrow-up\"></span><span class=\"sr-only\">Increase</span></button><button type=\"button\" class=\"btn btn-default spinbox-down btn-xs\"><span class=\"icon icon-arrow\"></span><span class=\"sr-only\">Decrease</span></button></div></div></div><div class=\"spinner-container datepicker-calendar-minute\"><div class=\"spinbox\" data-initialize=\"spinbox\"><input type=\"text\" class=\"form-control spinbox-input n-inputfield\"><div class=\"spinbox-buttons btn-group btn-group-vertical\"><button type=\"button\" class=\"btn btn-default spinbox-up btn-xs\"><span class=\"icon icon-arrow-up\"></span><span class=\"sr-only\">Increase</span></button><button type=\"button\" class=\"btn btn-default spinbox-down btn-xs\"><span class=\"icon icon-arrow\"></span><span class=\"sr-only\">Decrease</span></button></div></div></div><div class=\"spinner-container datepicker-calendar-AMPM\"><div class=\"spinbox\" data-initialize=\"spinbox\"><input id=\"s-normal\" type=\"text\" tabIndex=\"-1\" class=\"form-control spinbox-input n-inputfield n-inputfield-uneditable\" readonly><div class=\"spinbox-buttons btn-group btn-group-vertical\"><button type=\"button\" class=\"btn btn-default spinbox-up btn-xs\"><span class=\"icon icon-arrow-up\"></span><span class=\"sr-only\">Increase</span></button><button type=\"button\" class=\"btn btn-default spinbox-down btn-xs\"><span class=\"icon icon-arrow\"></span><span class=\"sr-only\">Decrease</span></button></div></div><input type=\"text\" tabIndex=\"-1\" class=\"form-control spinbox-input n-inputfield ampm n-inputfield-uneditable\" readonly></div><div class=\"operator-btn\"><button type=\"button\" class=\"btn btn-small now\">Now</button> <button type=\"button\" class=\"btn btn-action btn-small done\">Done</button></div></div></div><div class=\"datepicker-wheels\" aria-hidden=\"true\"><div class=\"datepicker-wheels-month\"><h2 class=\"header\">Month</h2><ul><li data-month=\"0\"><button type=\"button\">Jan</button></li><li data-month=\"1\"><button type=\"button\">Feb</button></li><li data-month=\"2\"><button type=\"button\">Mar</button></li><li data-month=\"3\"><button type=\"button\">Apr</button></li><li data-month=\"4\"><button type=\"button\">May</button></li><li data-month=\"5\"><button type=\"button\">Jun</button></li><li data-month=\"6\"><button type=\"button\">Jul</button></li><li data-month=\"7\"><button type=\"button\">Aug</button></li><li data-month=\"8\"><button type=\"button\">Sep</button></li><li data-month=\"9\"><button type=\"button\">Oct</button></li><li data-month=\"10\"><button type=\"button\">Nov</button></li><li data-month=\"11\"><button type=\"button\">Dec</button></li></ul></div><div class=\"datepicker-wheels-year\"><h2 class=\"header\">Year</h2><ul></ul></div><div class=\"datepicker-wheels-footer clearfix\"><button type=\"button\" class=\"btn datepicker-wheels-back\"><span class=\"icon icon-left\"></span><span class=\"sr-only\">Return to Calendar</span></button><button type=\"button\" class=\"btn datepicker-wheels-select\">Select <span class=\"sr-only\">Month and Year</span></button></div></div></div></div> </div></div>' );
				}
			} );

			//This is just a workaround method to off the focus event for input field
			//fuelux should provide an option to not to listen it.
			setTimeout( function() {
				$( '.datepicker .n-calendar .form-control' ).off( 'focus.fu.datepicker' );
			}, 25 );

		} );

		$.fn.datepicker.Constructor.prototype.initTimer = function() {
			//set time setting is shown
			this.options.showTime = true;

			//show timer setting panel
			$( this.$element.find( '.datepicker-calendar-timer' ) ).css( 'display', 'block' );

			this.$input.off( 'blur.fu.datepicker' );
			this.$input = this.$element.find( 'input:first' );
			this.$input.on( 'blur.fu.datepicker', $.proxy( this.inputBlurred, this ) );

			this.$hour = this.$element.find( '.datepicker-calendar-hour .spinbox' );
			this.$minute = this.$element.find( '.datepicker-calendar-minute .spinbox' );
			this.$ampm = this.$element.find( '.datepicker-calendar-AMPM .spinbox' );

			this.$hour.spinbox( 'max', 12 );
			this.$hour.spinbox( 'min', 1 );
			this.$minute.spinbox( 'max', 59 );
			this.$minute.spinbox( 'min', 0 );
			this.$ampm.spinbox( 'max', 1 );
			this.$ampm.spinbox( 'min', 0 );

			this.$element.find( '.now' ).on( 'click', showNow );
			this.$element.find( '.done' ).on( 'click', timeDone );

			this.resetTimer();

			//show time format when it is 12h
			if ( this.is12HoursFormat() ) { //24 hours H/HH
				$( this.$element.find( '.datepicker-calendar-AMPM' ) ).css( 'display', 'inline-block' );
			} else {
				this.$hour.spinbox( 'max', 23 );
				this.$hour.spinbox( 'min', 0 );
			}

			//add default button action for done
			this.$element.on( 'keyup', '.n-calendar', function( e ) {
				var ENTER_KEY = 13;
				if ( e.which === ENTER_KEY ) {
					timeDone( e );
				}
			} );
		};

		$.fn.datepicker.Constructor.prototype.dateClicked = function( e ) {
			var $td = $( e.currentTarget ).parents( 'td:first' );
			var date;

			if ( $td.hasClass( 'restricted' ) ) {
				return;
			}

			this.$days.find( 'td.selected' ).removeClass( 'selected' );
			$td.addClass( 'selected' );

			date = new Date( $td.attr( 'data-year' ), $td.attr( 'data-month' ), $td.attr( 'data-date' ) );
			this.selectedDate = date;

			if ( this.options.showTime ) {
				e.stopPropagation();
			} else {
				this.$input.val( this.formatDate( date ) );
				this.inputValue = this.$input.val();
				this.$input.focus();
				this.$element.trigger( 'dateClicked.fu.datepicker', date );
			}
		};

		$.fn.datepicker.Constructor.prototype.resetTimer = function() {
			setTime( this.$hour, this.$minute, this.$ampm, new Date(), this.is12HoursFormat() );
		};

		$.fn.datepicker.Constructor.prototype.is12HoursFormat = function() {
			return ( this.options.momentConfig.format.indexOf( 'H' ) < 0 );
		};

		$.fn.spinbox.Constructor.prototype.output = function( value, updateField ) {
			var ampm = $( this.$element ).parent().find( '.ampm' );
			if ( ampm.length > 0 ) {
				$( ampm[ 0 ] ).val( value % 2 === 0 ? 'PM' : 'AM' );
			}
			value = ( value + '' ).split( '.' ).join( this.options.decimalMark );
			updateField = ( updateField || true );

			if ( updateField ) {
				this.$input.val( value );
			}

			return value;
		};

		$.fn.spinbox.Constructor.prototype.max = function( maxValue ) {
			this.options.max = maxValue;
		};

		$.fn.spinbox.Constructor.prototype.min = function( minValue ) {
			this.options.min = minValue;
		};

		function setTime( hour, minute, ampm, date, is12HourFormat ) {
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var ampmValue = 0;

			if ( is12HourFormat ) {
				if ( hours >= 12 ) {
					ampmValue = 0;
				} else {
					ampmValue = 1;
				}

				if ( hours > 12 ) {
					hours = hours - 12;
				}
			}

			hour.spinbox( 'value', hours );
			minute.spinbox( 'value', minutes );
			ampm.spinbox( 'value', ampmValue );
		}

		function showNow( e ) {
			var calendar = $( e.currentTarget ).parents( '.datepicker' );
			var is12HoursFormat = calendar.datepicker( 'is12HoursFormat' );
			var currentDate = new Date();

			//show the correct date
			calendar.datepicker( 'setDate', currentDate );

			//show the correct time
			var timer = $( e.currentTarget ).parents( '.datepicker-calendar-timer' );
			var hour = timer.find( '.datepicker-calendar-hour .spinbox' );
			var minute = timer.find( '.datepicker-calendar-minute .spinbox' );
			var ampm = timer.find( '.datepicker-calendar-AMPM .spinbox' );
			setTime( hour, minute, ampm, currentDate, is12HoursFormat );
		}

		function timeDone( e ) {
			var calendar = $( e.currentTarget ).parents( '.datepicker' );
			var is12HoursFormat = calendar.datepicker( 'is12HoursFormat' );
			var d = calendar.datepicker( 'getDate' );

			var timer = calendar.find( '.datepicker-calendar-timer' );
			var hour = timer.find( '.datepicker-calendar-hour input' );
			var minute = timer.find( '.datepicker-calendar-minute input' );
			var ampm = timer.find( '.datepicker-calendar-AMPM .spinbox input' );
			var hours = parseInt( hour.val() );

			if ( is12HoursFormat && ampm.val() === '0' ) {
				hours += 12;
			}

			d.setHours( hours );
			d.setMinutes( minute.val() );
			calendar.datepicker( 'setDate', d );

			closeCalendar( calendar );
		}

		function closeCalendar( calendar ) {
			calendar.find( '.input-group-btn' ).removeClass( 'open' );
			var $input = calendar.find( 'input:first' );
			$input.next().find( ".dropdown-toggle" ).attr( "aria-expanded", "false" );
			if ( $input.hasClass( classNoRadiusLb ) ) {
				$input.removeClass( classNoRadiusLb );
			}
		}

		function updateTimer( e ) {
			var calendar = $( e.currentTarget );
			var date = calendar.datepicker( 'getDate' );
			var is12HoursFormat = calendar.datepicker( 'is12HoursFormat' );
			var hour = calendar.find( '.datepicker-calendar-hour .spinbox' );
			var minute = calendar.find( '.datepicker-calendar-minute .spinbox' );
			var ampm = calendar.find( '.datepicker-calendar-AMPM .spinbox' );

			setTime( hour, minute, ampm, date, is12HoursFormat );
		}

		function DisablePastDays() {
			var calendar = $( this ).closest( '.n-calendar-lock-past' );
			calendar.find( '.past' ).each( function() {
				$( this ).find( 'button' ).attr( 'disabled', 'disabled' );
			} );
		}

		// CALENDAR KEYBOARD ACCESSIBILITY
		// ===============================
		$( document ).on( 'keydown.wf.calendar.keyboard', '.datepicker-calendar-days', $.wfKBCalendar.calendarKeyboardHandler )
			.on( 'focusin.wf.calendar.keyboard', '.datepicker-calendar-days', $.wfKBCalendar.calendarFocusinHandler );

	} )( $ );


	//chart.js
	( function( $ ) {
		$( document ).ready( function() {
			if ( $.jqx !== undefined ) {
				if ( $.jqx.svgRenderer !== undefined ) {
					$.extend( $.jqx._jqxChart.prototype, {
						/** @private */
						_initRenderer: function( host ) {
							if ( !$.jqx.createRenderer ) {
								throw 'Please include jqxdraw.js';
							}
							var shadowDiv = document.createElement( "div" );
							$( shadowDiv ).addClass( 'panel-shadow' );
							shadowDiv.style.width = ( host.width() - 56 ) + 'px';
							shadowDiv.style.height = ( host.height() - 43 ) + 'px';
							$( shadowDiv ).css( {
								"background-color": "white",
								"border-radius": "9px"
							} );
							var render = $.jqx.createRenderer( this, host );
							$( host.find( ".chartContainer" ) ).css( {
								"z-index": "1"
							} );
							host.append( shadowDiv );
							return render;
						},
						/* jshint ignore:start */
						_animColumns: function( context, percent ) {
								var gidx = context.groupIndex;
								var group = this.seriesGroups[ gidx ];
								var renderData = context.renderData;
								var isWaterfall = group.type.indexOf( 'waterfall' ) != -1;
								var xAxis = this._getXAxis( gidx );

								var isStacked = group.type.indexOf( 'stacked' ) != -1;

								var polarAxisCoords = context.polarAxisCoords;

								var gradientType = this._getGroupGradientType( gidx );

								var columnWidth = context.columnGroupWidth.targetWidth;

								var firstVisibleSerie = -1;
								for ( var j = 0; j < group.series.length; j++ ) {
									if ( this._isSerieVisible( gidx, j ) ) {
										firstVisibleSerie = j;
										break;
									}
								}

								var minPos = NaN,
									maxPos = NaN;
								for ( var j = 0; j < context.seriesCtx.length; j++ ) {
									var serieCtx = context.seriesCtx[ j ];
									if ( isNaN( minPos ) || minPos > serieCtx.xAdjust )
										minPos = serieCtx.xAdjust;
									if ( isNaN( maxPos ) || maxPos < serieCtx.xAdjust + serieCtx.columnWidth )
										maxPos = serieCtx.xAdjust + serieCtx.columnWidth;
								}

								var realGroupWidth = Math.abs( maxPos - minPos );

								var xoffsets = context.renderData.xoffsets;

								var xPrev = -1;

								var yWaterfallPrev = {};

								// skipOverlappingPoints is off by default in column series
								var skipOverlappingPoints = group.skipOverlappingPoints == true;

								for ( var i = xoffsets.first; i <= xoffsets.last; i++ ) {
									var x = xoffsets.data[ i ];
									if ( isNaN( x ) )
										continue;

									if ( xPrev != -1 && Math.abs( x - xPrev ) < realGroupWidth && skipOverlappingPoints )
										continue;
									else
										xPrev = x;

									var offsets = this._getColumnVOffsets( renderData, gidx, context.seriesCtx, i, isStacked, percent );

									var isSummary = false;

									if ( isWaterfall ) {
										for ( var iSerie = 0; iSerie < group.series.length; iSerie++ ) {
											if ( group.series[ iSerie ].summary && xoffsets.xvalues[ i ][ group.series[ iSerie ].summary ] )
												isSummary = true;
										}
									}

									for ( var iSerie = 0; iSerie < context.seriesCtx.length; iSerie++ ) {
										var serieCtx = context.seriesCtx[ iSerie ];
										var sidx = serieCtx.seriesIndex;
										var serie = group.series[ sidx ];

										var from = offsets[ iSerie ].from;
										var to = offsets[ iSerie ].to;
										var xOffset = offsets[ iSerie ].xOffset;

										if ( !serieCtx.elements )
											serieCtx.elements = {};

										if ( !serieCtx.labelElements )
											serieCtx.labelElements = {};

										var elements = serieCtx.elements;
										var labelElements = serieCtx.labelElements;

										var startOffset = ( context.vertical ? context.rect.x : context.rect.y ) + serieCtx.xAdjust;

										var settings = serieCtx.settings;
										var colors = serieCtx.itemsColors.length != 0 ? serieCtx.itemsColors[ i - renderData.xoffsets.first ] : serieCtx.serieColors;

										var isVisible = this._isSerieVisible( gidx, sidx );

										if ( !isVisible /*&& !isStacked*/ )
											continue;

										var x = $.jqx._ptrnd( startOffset + xOffset );

										var rect = {
											x: x,
											width: serieCtx.columnWidth
										};

										if ( offsets[ iSerie ].funnel ) {
											rect.fromWidthPercent = offsets[ iSerie ].fromWidthPercent;
											rect.toWidthPercent = offsets[ iSerie ].toWidthPercent;
										}

										var isInverseDirection = true;

										if ( context.vertical ) {
											rect.y = from;
											rect.height = to - from;
											if ( rect.height < 0 ) {
												rect.y += rect.height;
												rect.height = -rect.height;
												isInverseDirection = false;
											}
										} else {
											rect.x = from < to ? from : to;
											rect.width = Math.abs( from - to );
											isInverseDirection = from - to < 0;
											rect.y = x;
											rect.height = serieCtx.columnWidth;
										}

										var size = from - to;
										if ( isNaN( size ) )
											continue;

										size = Math.abs( size );

										var pieSliceInfo = undefined;
										var isNewElement = elements[ i ] == undefined;

										if ( !polarAxisCoords ) {
											if ( offsets[ iSerie ].funnel ) // funnel or pyramid
											{
												var path = this._getTrapezoidPath( $.extend( {}, rect ), context.vertical, isInverseDirection );
												if ( isNewElement )
													elements[ i ] = this.renderer.path( path, {} );
												else
													this.renderer.attr( elements[ i ], {
														d: path
													} );
											} else { // regular column
												if ( isNewElement ) {
													elements[ i ] = this.renderer.rect( rect.x, rect.y, context.vertical ? rect.width : 0, context.vertical ? 0 : rect.height );
												} else {
													if ( context.vertical == true )
														this.renderer.attr( elements[ i ], {
															x: rect.x,
															y: rect.y,
															height: size + 5
														} ); //fixed by long
													else
														this.renderer.attr( elements[ i ], {
															x: rect.x,
															y: rect.y,
															width: size
														} );
												}
											}
										} else // column on polar axis
										{
											pieSliceInfo = this._columnAsPieSlice( elements, i, context.rect, polarAxisCoords, rect );
											var colors = this._getColors( gidx, sidx, undefined, 'radialGradient', pieSliceInfo.outerRadius );
										}

										if ( size < 1 && ( percent != 1 || polarAxisCoords ) )
											this.renderer.attr( elements[ i ], {
												display: 'none'
											} );
										else
											this.renderer.attr( elements[ i ], {
												display: 'block'
											} );

										if ( isNewElement )
											this.renderer.attr( elements[ i ], {
												fill: colors.fillColor,
												'fill-opacity': settings.opacity,
												'stroke-opacity': settings.opacity,
												stroke: colors.lineColor,
												'stroke-width': settings.stroke,
												'stroke-dasharray': settings.dashStyle
											} );

										this.renderer.removeElement( labelElements[ i ] );

										if ( !isVisible || ( size == 0 && percent < 1 ) )
											continue;

										/// Waterfall start
										if ( isWaterfall && this._get( [ serie.showWaterfallLines, group.showWaterfallLines ] ) != false ) {
											if ( !isStacked || ( isStacked && iSerie == firstVisibleSerie ) ) {
												var serieKey = isStacked ? -1 : iSerie;
												if ( percent == 1 && !isNaN( renderData.offsets[ iSerie ][ i ].from ) && !isNaN( renderData.offsets[ iSerie ][ i ].to ) ) {
													var prevWFInfo = yWaterfallPrev[ serieKey ];
													if ( prevWFInfo != undefined ) {

														var p1 = {
															x: prevWFInfo.x,
															y: $.jqx._ptrnd( prevWFInfo.y )
														};

														var p2 = {
															x: x,
															y: p1.y
														};

														var topWP = group.columnsTopWidthPercent / 100;
														if ( isNaN( topWP ) )
															topWP = 1;
														else if ( topWP > 1 || topWP < 0 )
															topWP = 1;

														var bottomWP = group.columnsBottomWidthPercent / 100;
														if ( isNaN( bottomWP ) )
															bottomWP = 1;
														else if ( bottomWP > 1 || bottomWP < 0 )
															bottomWP = 1;

														var sz = context.vertical ? rect.width : rect.height;

														p1.x = p1.x - sz / 2 + sz / 2 * topWP;

														if ( isSummary ) {
															var adj = sz * topWP / 2;
															p2.x = p2.x + sz / 2 - ( xAxis.flip ? -adj : adj );
														} else {
															var adj = sz * bottomWP / 2;
															p2.x = p2.x + sz / 2 - ( xAxis.flip ? -adj : adj );
														}

														if ( !context.vertical ) {
															this._swapXY( [ p1 ] );
															this._swapXY( [ p2 ] );
														}

														this.renderer.line(
															p1.x,
															p1.y,
															p2.x,
															p2.y, {
																stroke: prevWFInfo.color,
																'stroke-width': settings.stroke,
																'stroke-opacity': settings.opacity,
																'fill-opacity': settings.opacity,
																'stroke-dasharray': settings.dashStyle
															}
														);
													}
												}
											}

											if ( percent == 1 && size != 0 ) {
												yWaterfallPrev[ isStacked ? -1 : iSerie ] = {
													y: to,
													x: ( context.vertical ? rect.x + rect.width : rect.y + rect.height ),
													color: colors.lineColor
												};
											}
										}
										// Waterfall end

										if ( polarAxisCoords ) {
											var pointOuter = this._toPolarCoord( polarAxisCoords, context.rect, rect.x + rect.width / 2, rect.y );
											var sz = this._showLabel( gidx, sidx, i, rect, undefined, undefined, true );
											var labelRadius = pieSliceInfo.outerRadius + 10;

											var labelOffset = this._adjustTextBoxPosition(
												polarAxisCoords.x,
												polarAxisCoords.y,
												sz,
												labelRadius,
												( pieSliceInfo.fromAngle + pieSliceInfo.toAngle ) / 2,
												true,
												false,
												false
											);

											labelElements[ i ] = this._showLabel( gidx, sidx, i, {
												x: labelOffset.x,
												y: labelOffset.y
											}, undefined, undefined, false, false, false );
										} else {
											labelElements[ i ] = this._showLabel( gidx, sidx, i, rect, undefined, undefined, false, false, isInverseDirection );
										}

										if ( percent == 1.0 ) {
											this._installHandlers( elements[ i ], 'column', gidx, sidx, i );
										}
									}
								}
							}
							/* jshint ignore:end */
					} );
					$.extend( $.jqx.svgRenderer.prototype, {
						line: function( x1, y1, x2, y2, params ) {
							if ( y1 === y2 ) {
								x2 += 6;
							}
							var line = this.shape( 'line', {
								x1: x1,
								y1: y1,
								x2: x2,
								y2: y2
							} );
							this.attr( line, params );
							if ( x1 === x2 ) {
								this.attr( line, {
									"stroke-width": "0"
								} );
							}
							return line;
						},
						rect: function( c, j, d, f, i ) {
							c = $.jqx._ptrnd( c );
							j = $.jqx._ptrnd( j );
							d = Math.max( 1, $.jqx._rnd( d, 1, false ) );
							f = Math.max( 1, $.jqx._rnd( f, 1, false ) );
							var e = this.shape( "rect", {
								x: c,
								y: j,
								width: d,
								height: f
							} );
							if ( i ) {
								this.attr( e, i );
							}
							var round = f > 50 ? 9 : 5;
							this.attr( e, {
								rx: round
							} );
							return e;
						},
						_toLinearGradient: function( f, k, l ) {
							var d = "grd" + this._id + f.replace( "#", "" ) + ( k ? "v" : "h" );
							var c = "url(" + this.getWindowHref() + "#" + d + ")";
							if ( this._gradients[ c ] ) {
								return c;
							}

							var e = document.createElementNS( this._svgns, "linearGradient" );
							this.attr( e, {
								x1: "0%",
								y1: "0%",
								x2: k ? "0%" : "100%",
								y2: k ? "100%" : "0%",
								id: d
							} );
							var j = [ 0, 50, 50, 100 ];
							f = [ "#0B6DAF", "#0B6DAF", "#09578C", "#09578C" ];
							for ( var i = 0; i < j.length; i++ ) {
								var n = document.createElementNS( this._svgns, "stop" );
								var m = "stop-color:" + f[ i ]; //$.jqx.adjustColor(f, j[1]);
								this.attr( n, {
									offset: j[ i ] + "%",
									style: m
								} );
								e.appendChild( n );
							}
							this._defs.appendChild( e );
							this._gradients[ c ] = true;
							return c;
						}
					} );
				}
			}
		} );

	} )( $ );


	//combobox.js
	( function( $ ) {

		$( document ).on( 'click.bs.dropdown.data-api', '[data-toggle="dropdown"]', function() {
			if ( !$( this ).parents( ".combobox" ).hasClass( "n-page-combox" ) ) {
				$( ".n-page-combox" ).removeClass( "combobox-open" );
			}

			var cbOpen = $( ".combobox-open" );
			if ( cbOpen.length !== 0 ) {
				if ( cbOpen.find( "button" ).get( 0 ) !== $( this ).get( 0 ) ) {
					cbOpen.toggleClass( 'combobox-open' );
				}
			}

			if ( $( this ).parents( ".combobox" ).length !== 0 ) {
				$( this ).parents( ".combobox" ).toggleClass( 'combobox-open' );
			}

			var comboBox = $( this ).parents( ".combobox" );
			if ( $( comboBox ).hasClass( "combobox-filter" ) ) {
				var inputFiled = comboBox.find( "input" );
				inputFiled.focus();
				if ( $( comboBox ).hasClass( "combobox-open" ) ) {
					$( inputFiled ).on( "input", function() {
						doFilter( comboBox );
					} );

					var allItems = comboBox.find( "ul li" );
					var size = allItems.size();
					for ( var i = 0; i < size; i++ ) {
						$( allItems[ i ] ).removeClass( "combobox-item-hidden" );
					}
				} else {
					inputFiled.unbind( "input" );
				}

				comboBox.find( "ul" ).addClass( "combobox-filter-dropdown-menu" );
			}
		} );

		$( document ).on( 'keydown', '.combobox input', function( e ) {
			var comboBox = $( this ).parent( ".combobox" );
			if ( e.which === 38 || e.which === 40 ) {
				e.preventDefault();
				var a = jQuery.Event( "keydown" );
				a.which = e.which;
				comboBox.find( "button.dropdown-toggle" ).trigger( a );
				comboBox.find( "button.dropdown-toggle" ).focus();
			}
			if ( comboBox.hasClass( "combobox-filter" ) && !comboBox.hasClass( "combobox-open" ) ) {
				if ( ( e.which === 229 || e.which === 65 ) || ( e.which >= 48 && e.which <= 57 ) || ( e.which > 65 && e.which <= 111 ) || ( e.which >= 186 && e.which <= 222 ) ) {
					comboBox.find( "button.dropdown-toggle" ).trigger( "click" );
				}
			}
		} );

		$( document ).on( 'click.bs.dropdown.data-api', function() {
			var cbOpen = $( ".combobox-open" );
			if ( cbOpen.length !== 0 ) {
				if ( cbOpen.hasClass( "combobox-filter" ) ) {

					if ( !cbOpen.find( "input" ).is( ":focus" ) ) {
						cbOpen.find( "input" ).unbind( "input" );
						cbOpen.removeClass( 'combobox-open' );
					} else {
						cbOpen.find( ".input-group-btn" ).addClass( "open" );
						cbOpen.find( "button" ).attr( "aria-expanded", "true" );
					}
				} else {
					cbOpen.removeClass( 'combobox-open' );
				}
			}
		} );

		function doFilter( comboBox ) {
			if ( comboBox.find( "ul" ).length !== 0 ) {
				var allItems = comboBox.find( "ul li" );
				var size = allItems.size();
				if ( comboBox.find( "input" ).val() !== "" ) {
					var inputText = comboBox.find( "input" ).val();
					var reg = "/" + inputText.replace( /\*/g, ".*" ) + "/gi";
					for ( var i = 0; i < size; i++ ) {
						if ( eval( reg ).test( allItems[ i ].textContent ) ) {
							$( allItems[ i ] ).removeClass( "combobox-item-hidden" );
						} else {
							$( allItems[ i ] ).addClass( "combobox-item-hidden" );
						}
					}
				} else {
					for ( var j = 0; j < size; j++ ) {
						$( allItems[ j ] ).removeClass( "combobox-item-hidden" );
					}
				}
			}
		}

		$( document ).on( 'keyup change', '.n-cancel-button input', function( event ) {
			var inputValue = event.target.value;
			var controlIcon = $( event.target ).next( '.n-clear-button-icon' );
			if ( inputValue.length > 0 ) {
				controlIcon.show();
			} else {
				controlIcon.hide();
			}
		} );

		$( document ).on( 'click', '.n-clear-button-icon', function() {
			var prev = $( this ).prev();
			if ( prev.hasClass( "n-inputfield" ) ) {
				$( this ).hide();
				prev.val( "" );
				prev.attr( "placeholder", "Text" );
				prev.focus();
			}
		} );
		$( document ).ready( function() {
			$( document ).on( 'shown.bs.dropdown', '.combobox, .n-combobutton', function() {
				$( this ).find( 'ul.dropdown-menu li a' ).each( function() {
					var $this = $( this );
					var hasTooltip = $this.attr( 'data-toggle' ) === "tooltip";
					var hasEllipsis = $this[ 0 ].offsetWidth < $this[ 0 ].scrollWidth;

					if ( hasEllipsis ) {
						if ( !hasTooltip ) {
							$this.attr( 'title', $this.text() );
							$this.attr( 'data-toggle', "tooltip" );
							$this.attr( 'data-placement', "right" );
							$this.tooltip();
						} else {
							$this.tooltip( 'enable' );
						}
					} else if ( hasTooltip && !hasEllipsis ) {
						$this.tooltip( 'disable' );
					}
				} );
			} );
		} );

		// COMBOBOX KEYBOARD ACCESSIBILITY
		// ===============================
		function comboboxKeyboardHandler( e ) {
			var current = $( e.target );
			if ( e.keyCode === 13 || e.keyCode === 32 ) {
				if ( current.hasClass( 'n-filter-clear-control' ) ) {
					e.preventDefault();
					current.find( 'span' ).trigger( 'click' );
				}
			}
		}

		$( document ).on( 'keydown.wf.combobox.keyboard', '.combobox', comboboxKeyboardHandler );

	} )( $ );


	//dlg-wizard.js
	( function( $ ) {

		$.fn.extend( {
			initWizard: function() {
				$( this ).bootstrapWizard( {
					nextSelector: '.button-next',
					previousSelector: '.button-previous',
					firstSelector: '.button-first',
					lastSelector: '.button-last'
				} );

				// init steps width
				var $steps = $( this ).find( ".navbar-inner>ul>li" );
				var distance = ( 100 / ( $steps.length - 1 ) ).toFixed( 3 );
				var remainder = ( 40 / ( $steps.length - 1 ) );
				$steps.not( ":last-child" ).css( "width", "calc(" + distance + "% - " + remainder + "px)" );
			}
		} );

		$( ".n-dlg-wizard" ).on( "click", ".modal-footer>input[type=button]", function() {
			var activeTab = $( this ).closest( ".modal-footer" ).prev( ".modal-body" ).find( "li.active" );
			addPassStyle( activeTab );
		} );

		$( document ).on( 'click.bs.modal.data-api', '[data-toggle="modal"]', function() {
			var $wizard = $( ".n-dlg-wizard.in" );
			if ( $wizard.length > 0 ) {
				// set next button as focus and reset to the first step
				$wizard.find( "input[type=button][name=next]" ).focus();
				$wizard.find( "input[type=button][name=first]" ).trigger( "click" );
			}
		} );

		function addPassStyle( activeTab ) {
			activeTab.removeClass( "passed" ).siblings( "li" ).removeClass( "passed" );
			var $passedSteps = activeTab.prevAll( "li" );
			if ( $passedSteps.length > 0 ) {
				$passedSteps.addClass( "passed" );
			}
		}

	} )( $ );


	//drag.js
	( function( $ ) {

		var Drag = function( el, opt ) {
			opt = $.extend( {
				handle: "",
				cursor: "move"
			}, opt );
			var dragObject = this;
			el = $( el );
			dragObject.init = function() {
				el.css( 'cursor', opt.cursor );
				var $drag = el.parent().addClass( 'draggable' );
				var zIdx, drgH, drgW, posY, posX;
				el.get( 0 ).addEventListener( 'mousedown', initDrag, false );

				function initDrag( e ) {
					zIdx = $drag.css( 'z-index' );
					drgH = $drag.outerHeight();
					drgW = $drag.outerWidth();
					posY = $drag.offset().top + drgH - e.pageY;
					posX = $drag.offset().left + drgW - e.pageX;
					$drag.css( 'z-index', 1000 );
					document.documentElement.addEventListener( 'mousemove', doDrag, false );
					document.documentElement.addEventListener( 'mouseup', stopDrag, false );
				}

				function doDrag( e ) {
					var top = e.pageY + posY - drgH;
					var left = e.pageX + posX - drgW;


					// check if target is outside fo window
					if ( top < -20 ) {
						top = -20;
					}
					if ( top > window.innerHeight - drgH / 2 ) {
						top = window.innerHeight - drgH / 2;
					}
					if ( left < -drgH * 0.8 ) {
						left = -drgH * 0.8;
					}
					if ( left > window.innerWidth - drgH / 2 ) {
						left = window.innerWidth - drgH / 2;
					}

					$drag.offset( {
						top: top,
						left: left
					} );
					e.preventDefault();
				}

				function stopDrag() {
					$drag.removeClass( 'draggable' ).css( 'z-index', zIdx );
					document.documentElement.removeEventListener( 'mousemove', doDrag, false );
					document.documentElement.removeEventListener( 'mouseup', stopDrag, false );
				}
			};

			dragObject.init();
		};

		var HTMLAttributes = function() {
			var input = $( this ),
				options = {},
				drag = ( input.attr( 'data-drag' ) === 'true' || input.attr( 'data-drag' ) === 'True' );

			if ( drag ) {
				return input.data( 'wf.dragable', new Drag( this, options ) );
			}
		};

		var globalsDrag = {
			dragElements: 'div',
			dataDragAttr: '*[data-drag]'
		};

		var applyDataDrag = function( selector ) {
			selector = selector || globalsDrag.dragElements;
			var $selector = ( selector instanceof $ ) ? selector : $( selector );
			$selector.filter( globalsDrag.dataDragAttr ).each( HTMLAttributes );
		};

		var old = $.fn.dragable;

		$.fn.dragable = function( options ) {
			options = options || {};
			var dragFunction = function() {
				return $( this ).data( 'wf.dragable', new Drag( this, options ) );

			};
			$( this ).each( dragFunction );
			return this;
		};

		$.fn.dragable.noConflict = function() {
			$.fn.dragable = old;
			return this;
		};

		$( document ).ready( function() {
			applyDataDrag( 'div' );
		} );

	} )( $ );


	//drawer.js
	( function( $ ) {

		var $flyout = $( '.n-flyout' );
		$flyout.on( 'click', '.n-drawer-tabs a', function() {
			var $li = $( this ).parent( 'li' );
			var id = $( this ).attr( 'href' );
			setTimeout( function() {
				$li.parent( 'ul' ).find( 'li' ).each( function() {
					$( this ).removeClass( 'selected' ).removeClass( 'before-selected' ).removeClass( 'after-selected' );
				} );
				$li.addClass( 'selected' );
				$li.next( 'li' ).addClass( 'after-selected' );
				$li.prev( 'li' ).addClass( 'before-selected' );

				$( '.n-flyout-container' ).hide();
				id = id.replace( '#', '' );
				$( '#' + id ).show();
			}, 50 );

		} );

		$flyout.on( 'click', '.drawer-toggle-up', function() {
			$( this ).removeClass( 'drawer-toggle-up' ).addClass( 'drawer-toggle-down' );
			$( '.n-flyout-open' ).trigger( 'click' );
		} );

		$flyout.on( 'click', '.drawer-toggle-down', function() {
			$( this ).removeClass( 'drawer-toggle-down' ).addClass( 'drawer-toggle-up' );
			$( '.n-flyout-open' ).find( '.selected' ).trigger( 'click' );
		} );


	} )( $ );


	//drilldown.js
	( function( $ ) {

		var Drilldown = {
			toggle: function( e ) {
				var $table = $( this ).closest( 'table' );

				initDrilldownContentBottomRadius( $table );

				if ( isFunctionKey( e ) ) {
					return;
				}

				var isSelected, isExpanded;
				if ( $( this ).is( 'tr' ) ) {
					isSelected = true;
					isExpanded = $( this ).find( 'td' ).data( 'expanded' );
				} else {
					isSelected = $( this ).hasClass( 'n-drilldown-item-selected' );
					isExpanded = $( this ).data( 'expanded' );
				}
				var targetContent = $( $( this ).data( 'targetSelector' ) );

				if ( isExpanded === true && isSelected === true ) {
					collapseDrilldownContent( targetContent );
				} else {
					var arrowDistance = $( this ).position().left + $( this ).width() / 2;
					var arrowDistancePxValue = arrowDistance + 'px';

					if ( isExpanded === true && isSelected === false ) {
						selectDrilldownContent( targetContent, $( this ), arrowDistancePxValue );
					} else {
						expandDrilldownContent( targetContent, $( this ), arrowDistancePxValue );
					}
				}
			},

			collapse: function( e ) {
				if ( e.keyCode === 27 || typeof( e.keyCode ) === "undefined" ) {
					var content, row;
					if ( $( this ).is( 'span' ) ) {
						content = $( this ).closest( '.n-drillDown-collapsed' );
						row = $( this ).closest( ".n-drillDown-collapsed-row" );
					} else if ( $( this ).is( 'table' ) ) {
						content = $( this ).find( '.n-drillDown-collapsed' );
						row = $( this ).find( ".n-drillDown-collapsed-row" );
					}
					if ( content.length > 0 ) {
						collapseDrilldownContent( content );
					} else if ( row.length > 0 ) {
						collapseDrilldownRow( row );
					}
				}
			},

			relocateArrow: function() {
				var drilldownItem = $( '.n-drilldown-item-selected' );
				if ( drilldownItem.length === 0 ) {
					return;
				}
				var arrowDistance = drilldownItem.position().left + drilldownItem.width() / 2;
				var arrowDistancePxValue = arrowDistance + "px";
				$( ".n-drillDown-arrow" ).css( "left", arrowDistancePxValue );
			}
		};

		// DRILLDOWN INTERNAL METHODS
		// ==========================

		function collapseDrilldownContent( content ) {
			content.slideUp( function() {
				var $table = $( this ).closest( 'table' );
				setBottomRadius( $table, '7' );
			} );
			itemCollapse( content );
		}

		function selectDrilldownContent( content, item, arrowDistance ) {
			$( '.n-drillDown-arrow' ).animate( {
				left: arrowDistance
			} );
			content.show().siblings().stop( true, true ).hide();
			itemSelect( item );
		}

		function expandDrilldownContent( content, item, arrowDistance ) {
			$( '.n-drillDown-collapsed' ).hide();
			$( '.n-drillDown-collapsed-row' ).hide();
			$( '.n-drillDown-arrow' ).css( 'left', arrowDistance );
			itemCollapse( content );

			content.slideDown();
			var $table = item.closest( 'table' );
			var lastRowHeight = $table.find( "tr:last" ).height();
			if ( lastRowHeight > 0 ) {
				setBottomRadius( $table, '0' );
			} else {
				setBottomRadius( $table, '7' );
			}
			itemExpand( item );
		}

		function collapseDrilldownRow( row ) {
			row.slideUp( function() {
				var $table = $( this ).closest( 'table' );
				setBottomRadius( $table, '7' );
			} );
		}

		function initDrilldownContentBottomRadius( table ) {
			var drilldownInner = table.find( 'tr:last-child' ).find( '.n-drillDown-inner' );
			drilldownInner.css( 'border-bottom-left-radius', '7px' ).css( 'border-bottom-right-radius', '7px' );
			var drilldownContent = table.find( 'tr:last-child' ).find( '.n-drillDown-content' );
			drilldownContent.css( 'border-bottom-left-radius', '7px' ).css( 'border-bottom-right-radius', '7px' );
		}

		function isFunctionKey( e ) {
			var ctrlKeyPressed = ( window.event && window.event.ctrlKey ) || e.ctrlKey;
			var shiftKeyPressed = ( window.event && window.event.shiftKey ) || e.shiftKey;
			return ctrlKeyPressed || shiftKeyPressed;
		}

		function setBottomRadius( table, radius ) {
			table.find( 'tr:nth-last-child(2)' ).find( 'td:first-child' ).css( 'border-bottom-left-radius', radius + 'px' );
			table.find( 'tr:nth-last-child(2)' ).find( 'td:last-child' ).css( 'border-bottom-right-radius', radius + 'px' );
		}

		function itemExpand( item ) {
			if ( item.is( 'td' ) ) {
				item.siblings( 'td' ).removeClass( 'n-drilldown-item-selected' );
				item.addClass( 'n-drilldown-item-selected' );
				item.data( 'expanded', true );
				item.siblings( 'td' ).data( 'expanded', true );
			} else {
				item.find( 'td' ).data( 'expanded', true );
			}
		}

		function itemCollapse( content ) {
			content.closest( 'table' ).find( 'td' ).each( function() {
				$( this ).data( 'expanded', false );
				$( this ).removeClass( 'n-drilldown-item-selected' );
			} );
		}

		function itemSelect( item ) {
			if ( item.is( 'td' ) ) {
				item.siblings( 'td' ).removeClass( 'n-drilldown-item-selected' );
				item.addClass( 'n-drilldown-item-selected' );
			}
		}

		$( document )
			.on( 'click.wf.drilldown', '.n-drillDown-item', Drilldown.toggle )
			.on( 'click.wf.drilldown', '.n-drillDown-row', Drilldown.toggle )
			.on( 'click.wf.drilldown', '.n-drillDown-content .icon-close-rounded', Drilldown.collapse )
			.on( 'click.wf.drilldown', '.n-drillDown-collapsed-row .icon-close-rounded', Drilldown.collapse )
			.on( 'keyup.wf.drilldown.keyboard', '.n-drilldown-table', Drilldown.collapse );

		$( window ).on( 'resize.wf.drilldown', Drilldown.relocateArrow );

		return Drilldown;

	} )( $ );


	//grid.js
	( function( $ ) {

		jQuery.browser = {};
		jQuery.browser.mozilla = /mozilla/.test( navigator.userAgent.toLowerCase() ) && !/webkit/.test( navigator.userAgent.toLowerCase() );
		jQuery.browser.webkit = /webkit/.test( navigator.userAgent.toLowerCase() );
		jQuery.browser.opera = /opera/.test( navigator.userAgent.toLowerCase() );
		jQuery.browser.msie = /msie/.test( navigator.userAgent.toLowerCase() );

		var $jqxTable = $( '.n-jqxgrid-table' );
		$.grid = {
			/*---------------- nokia TextField render/editor ----------------*/
			nTextFieldCellRenderer: function( row, column, value ) {
				return '<input class="n-inputfield n-inputfield-small" value="' + value + '" tabindex="-1"/>';
			},

			nCreateTextFieldEditor: function( row, cellValue, editor ) {
				// construct the editor.
				var element = $( '<input class="n-inputfield n-inputfield-small" />' );
				editor.append( element );

				editor.on( 'keydown', function( e ) {
					handleTabKey( e, $( this ), row );
				} );
			},

			nInitTextFieldEditor: function( row, cellValue, editor ) {
				// set the editor's current value. The callback is called each time the editor is displayed.
				var inputHTMLElement = editor.find( "input" );
				inputHTMLElement.val( cellValue );
				setTimeout( function() {
					inputHTMLElement.focus();
				}, 50 );
			},

			nGetTextFieldEditorValue: function( row, cellValue, editor ) {
				return editor.find( "input" ).val();
			},

			/*---------------- nokia Indicator textField render/editor ----------------*/
			nIndicatorTextFieldCellRenderer: function( gridId ) {
				return function( row, columnfield, value ) {
					var edited = '';
					$( gridId + " .n-grid-inputfield-indicated" ).each( function() {
						var idMatched = false;
						var id = $( this ).parent().attr( 'id' );
						if ( id !== undefined ) {
							if ( id.indexOf( columnfield + "_" + row ) >= 0 ) {
								idMatched = true;
							}
						}

						if ( $( this ).find( "input" ).val() === value && idMatched ) {
							if ( $( this ).find( ".icon" ).hasClass( "icon-edited-small" ) ) {
								edited = 'icon-edited-small';
							}
						}
					} );

					return '<div class="n-grid-inputfield-indicated">' +
						'<input class="n-inputfield n-inputfield-small" value="' + value + '" tabindex="-1">' +
						'<a class="form-control-feedback"><span class="icon ' + edited + '"></span></a>' +
						'</div>';
				};
			},

			nCreateIndicatorTextFieldEditor: function( row, cellValue, editor ) {
				// construct the editor.
				var gridId = editor.parent().attr( "id" ).replace( "contenttable", "" );
				var isIndicatedByCell = checkIndicatedByCell( editor );
				var element = '<div class="n-grid-inputfield-indicated">' +
					'<input class="n-inputfield n-inputfield-small"/>' +
					'<a class="form-control-feedback"><span class="icon"></span></a>' +
					'</div>';
				editor.append( element );
				var editorId = editor.attr( "id" );
				var inputHTMLElement = editor.find( "input" );
				inputHTMLElement.bind( 'input', function() {
					if ( inputHTMLElement.val() !== cellValue ) {
						if ( isIndicatedByCell ) {
							editor.find( ".icon" ).addClass( "icon-edited-small" );
						}
						$( "#" + gridId + " #n-row-indicated-" + row + " > span" ).addClass( "icon-edited-white" );
						addChangedCol( row, editorId, gridId );
					} else {
						editor.find( ".icon" ).removeClass( "icon-edited-small" );
						removeChangedCol( row, editorId, gridId );
					}
				} );

				editor.on( 'keydown', function( e ) {
					handleTabKey( e, $( this ), row );
				} );
			},

			nInitIndicatorTextFieldEditor: function( row, cellValue, editor ) {
				// set the editor's current value. The callback is called each time the editor is displayed.
				var inputHTMLElement = editor.find( "input" );
				inputHTMLElement.val( cellValue );
				inputHTMLElement.focus();
			},

			nGetIndicatorTextFieldEditorValue: function( row, cellValue, editor ) {
				return editor.find( "input" ).val();
			},

			/*---------------- nokia String Field render/editor ----------------*/
			nStringCellRenderer: function( row, columnfield, value, defaulthtml ) {
				var html = defaulthtml;
				if ( value.indexOf( '#errordata#' ) !== -1 ) {
					html = html.replace( 'class="', 'class="n-cell-error ' );
					html = html.replace( '#errordata#', '' );
				}
				return html;
			},

			/*---------------- nokia Number Field render/editor ----------------*/
			nNumberCellRenderer: function( row, columnfield, value, defaulthtml ) {
				var cellValue = value.toString();
				var html = defaulthtml;
				if ( cellValue.indexOf( '((' ) === 0 && cellValue.indexOf( '))' ) === cellValue.length - 2 ) {
					html = html.replace( 'class="', 'class="n-cell-error ' );
					html = html.replace( '((', '' );
					html = html.replace( '))', '' );
				}
				return html;
			},

			/*---------------- nokia Checkbox render/editor ----------------*/
			nCheckboxCellsrenderer: function( checkLabel ) {
				var _checkLabel = checkLabel;
				return function( row, column, value ) {
					var checkboxId = 'cb' + row + Date.now();
					return '<div class="checkbox checkbox-small">' +
						'<input id="' + checkboxId + '" type="checkbox" ' + ( value ? ' checked="true"' : '' ) + ' tabindex="-1"/>' +
						'<label for="' + checkboxId + '">' + _checkLabel + '</label>' +
						'</div>';
				};
			},
			nCreateCheckboxEditor: function( checkLabel ) {
				var _checkLabel = checkLabel;
				return function( row, value, editor ) {
					// construct the editor.
					var checkboxId = 'cb' + row + Date.now();
					var target = ( value ) ? ' checked="true"' : '';
					var element = '<div class="checkbox checkbox-small margin-add-one">' +
						'<input id="' + checkboxId + '" type="checkbox" ' + ( target ) + '/>' +
						'<label for="' + checkboxId + '">' + _checkLabel + '</label>' + '</div>';
					editor.append( element );

					editor.on( 'keydown', function( e ) {
						handleTabKey( e, $( this ), row );
					} );
				};
			},

			nInitCheckboxEditor: function( row, cellValue, editor ) {
				// set the editor's current value. The callback is called each time the editor is displayed.
				var inputHTMLElement = editor.find( "input" );
				var current = inputHTMLElement.prop( "checked" );
				inputHTMLElement.prop( {
					checked: !current
				} );
				inputHTMLElement.prop( "checked" );
				inputHTMLElement.focus();
			},
			nGetCheckboxEditorValue: function( row, cellValue, editor ) {
				var inputHTMLElement = editor.find( "input" );
				return inputHTMLElement.prop( "checked" );
			},
			/*---------------- nokia Indicator Checkbox render/editor ----------------*/
			nIndicatorCheckboxCellsrenderer: function( gridId, checkLabel ) {
				var _checkLabel = checkLabel;
				return function( row, column, value ) {
					var edited = '';
					var orignalValue = '';
					$( gridId + " .grid-checkbox-indicated" ).each( function() {
						var idMatched = false;
						var id = $( this ).parent().attr( 'id' );
						if ( id !== undefined ) {
							if ( id.indexOf( column + "_" + row ) >= 0 ) {
								idMatched = true;
							}
						}

						if ( idMatched ) {
							if ( $( this ).find( ".icon" ).hasClass( "icon-edited-small" ) ) {
								edited = 'icon-edited-small';
							}
							if ( $( this ).find( ".icon" ).hasClass( "icon-edited-small-white" ) ) {
								edited = 'icon-edited-small-white';
							}
							orignalValue = $( this ).find( "input" ).attr( "orignal-value" );
						}
					} );
					var checkboxId = 'cb' + row + Date.now();
					return '<div id="indicator-checkbox-' + row + '" class="checkbox checkbox-small grid-checkbox-indicated">' +
						'<input id="' + checkboxId + '" type="checkbox" ' + ( value ? ' checked="true"' : '' ) + ' orignal-value="' + orignalValue + '" tabindex="-1"/>' +
						'<label for="' + checkboxId + '">' + _checkLabel + '</label>' +
						'<span class="icon align-right ' + edited + '"></span>' +
						'</div>';
				};
			},
			nCreateIndicatorCheckboxEditor: function( checkLabel ) {
				var _checkLabel = checkLabel;
				return function( row, value, editor ) {
					// construct the editor.
					var checkboxId = 'cb' + row + Date.now();
					var target = ( value ) ? ' checked="true"' : '';
					var element = '<div id="indicator-checkbox-' + row + '" class="checkbox checkbox-small margin-add-one grid-checkbox-indicated">' +
						'<input id="' + checkboxId + '" type="checkbox" ' + ( target ) + ' orignal-value="' + value + '"/>' +
						'<label for="' + checkboxId + '">' + _checkLabel + '</label>' +
						'<span class="icon align-right editor"></span>' + '</div>';
					editor.append( element );

					editor.on( 'keydown', function( e ) {
						handleTabKey( e, $( this ), row );
					} );
				};
			},

			nInitIndicatorCheckboxEditor: function( row, cellValue, editor ) {
				// set the editor's current value. The callback is called each time the editor is displayed.
				var gridId = editor.parent().attr( "id" ).replace( "contenttable", "" );
				var isIndicatedByCell = checkIndicatedByCell( editor );
				var inputHTMLElement = editor.find( "input" );
				var current = inputHTMLElement.prop( "checked" );
				inputHTMLElement.prop( {
					checked: !current
				} );
				inputHTMLElement.prop( "checked" );
				inputHTMLElement.focus();
				var editorId = editor.attr( "id" );
				if ( current.toString() === inputHTMLElement.attr( "orignal-value" ) ) {
					if ( isIndicatedByCell ) {
						editor.find( ".icon" ).addClass( "icon-edited-small-white" );
					}
					$( "#" + gridId + " #n-row-indicated-" + row + " > span" ).addClass( "icon-edited-white" );
					addChangedCol( row, editorId, gridId );
				} else {
					editor.find( ".icon" ).removeClass( "icon-edited-small-white" );
					removeChangedCol( row, editorId, gridId );
				}
				inputHTMLElement.change( function() {
					if ( inputHTMLElement.prop( "checked" ).toString() === inputHTMLElement.attr( "orignal-value" ) ) {
						editor.find( ".icon" ).removeClass( "icon-edited-small-white" );
						removeChangedCol( row, editorId, gridId );
					} else {
						if ( isIndicatedByCell ) {
							editor.find( ".icon" ).addClass( "icon-edited-small-white" );
						}
						$( "#" + gridId + " #n-row-indicated-" + row + " > span" ).addClass( "icon-edited-white" );
						addChangedCol( row, editorId, gridId );
					}
				} );
			},
			nGetIndicatorCheckboxEditorValue: function( row, cellValue, editor ) {
				var inputHTMLElement = editor.find( "input" );
				return inputHTMLElement.prop( "checked" );
			},
			/*---------------- nokia dropdownlist render/editor ----------------*/
			dropdownlistCellsrenderer: function( row, columnfield, value ) {
				return '<div class="btn-group selectlist selectlist-small selectlist-resize" data-resize="none" data-initialize="selectlist">' +
					'<button class="btn btn-default dropdown-toggle" data-toggle="dropdown" type="button" tabindex="-1">' +
					'<span class="selected-label">' + value + '</span>' +
					'<span class="selected-caret" ><span class="caret"></span></span>' +
					'</button>' +
					'<ul class="dropdown-menu" role="menu">' +
					'<li data-value="1">' + '<a href="#">' + '<span>' + value + '</span>' + '</a>' + '</li>' +
					'</ul>' + '</div>';
			},

			dropdownlistEditor: function( dropdownlists ) {
				var _dropdownlists = dropdownlists;
				return function( row, cellValue, editor, cellText, width ) {
					editor.jqxDropDownList( {
						autoDropDownHeight: false,
						itemHeight: 27,
						dropDownHeight: '150px',
						scrollBarSize: 8,
						width: width - 4,
						height: 24,
						source: _dropdownlists.map( function( name ) {
							return "<span>" + name + "</span>";
						} )
					} );

					editor.on( 'keydown', function( e ) {
						handleTabKey( e, $( this ), row );
					} );
				};
			},

			dropdownlistInitEditor: function( row, cellValue, editor ) {
				editor.jqxDropDownList( 'selectItem', '<span>' + cellValue + '</span>' );
				editor.jqxDropDownList( 'focus' );
				editor.jqxDropDownList( 'open' );
			},

			dropdownlistEditorValue: function( row, cellValue, editor ) {
				return editor.val();
			},
			/*---------------- nokia dropdownlist render/editor ----------------*/
			indicatorDropdownlistCellsrenderer: function( gridId ) {
				return function( row, columnfield, value ) {
					var edited = '';
					$( gridId + " .grid-selectlist-indicated" ).each( function() {
						var idMatched = false;
						var id = $( this ).parent().attr( 'id' );
						if ( id !== undefined ) {
							if ( id.indexOf( columnfield + "_" + row ) >= 0 ) {
								idMatched = true;
							}
						}
						if ( idMatched ) {
							if ( $( this ).find( ".icon" ).hasClass( "icon-edited-small" ) ) {
								edited = 'icon-edited-small';
							}
						}
					} );

					return '<div class="btn-group selectlist selectlist-small selectlist-resize selectlist-indicated" data-resize="none" data-initialize="selectlist" id="mySelectlist' + row + '">' +
						'<button class="btn btn-default dropdown-toggle" data-toggle="dropdown" type="button" tabindex="-1">' +
						'<span class="selected-label">' + value + '</span>' +
						'<span class="selected-caret" ><span class="caret"></span></span>' +
						'</button>' +
						'<ul class="dropdown-menu" role="menu">' +
						'<li data-value="1">' + '<a href="#">' + '<span>' + value + '</span>' + '</a>' + '</li>' +
						'</ul>' +
						'<a class="form-control-feedback">' +
						'<span class="icon ' + edited + '"></span>' +
						'</a>' +
						'</div>';
				};
			},

			indicatorDropdownlistEditor: function( dropdownlists ) {
				var _dropdownlists = dropdownlists;
				return function( row, cellValue, editor, cellText, width ) {
					var gridId = editor.parent().attr( "id" ).replace( "contenttable", "" );
					var isIndicatedByCell = checkIndicatedByCell( editor );
					var editorId = editor.attr( "id" );
					editor.jqxDropDownList( {
						autoDropDownHeight: false,
						itemHeight: 27,
						dropDownHeight: '150px',
						scrollBarSize: 8,
						width: width - 4,
						height: 24,
						source: _dropdownlists.map( function( name ) {
							return "<span>" + name + "</span>";
						} ),
						selectionRenderer: function() {
							var item = editor.jqxDropDownList( 'getSelectedItem' );
							if ( item !== null ) {
								if ( item.value.indexOf( cellText ) >= 0 ) {
									removeChangedCol( row, editorId, gridId );
									return item.value;
								} else {
									addChangedCol( row, editorId, gridId );
									$( "#" + gridId + " #n-row-indicated-" + row + " > span" ).addClass( "icon-edited-white" );
									if ( isIndicatedByCell ) {
										return item.value + '<div class="grid-selectlist-indicated"><a class="form-control-feedback"><span class="icon icon-edited-small"></span></a></div>';
									} else {
										return item.value;
									}
								}
							}
						}
					} );
					editor.on( 'keydown', function( e ) {
						handleTabKey( e, $( this ), row );
					} );
				};
			},

			indicatorDropdownlistInitEditor: function( row, cellValue, editor ) {
				editor.jqxDropDownList( 'selectItem', '<span>' + cellValue + '</span>' );
				editor.jqxDropDownList( 'focus' );
				editor.jqxDropDownList( 'open' );
			},

			indicatorDropdownlistEditorValue: function( row, cellValue, editor ) {
				return editor.val();
			},

			/*---------------- nokia indicator ----------------*/
			indicatorRenderer: function( gridId ) {
				return function( row ) {
					var edited = '';
					if ( $( gridId + " #n-row-indicated-" + row + " > span" ).hasClass( "icon-edited" ) ) {
						edited = "icon-edited";
					}
					if ( $( gridId + " #n-row-indicated-" + row + " > span" ).hasClass( "icon-edited-white" ) ) {
						edited = "icon-edited-white";
					}
					var changedCol = $( gridId + " #n-row-indicated-" + row ).attr( "changed-col" );
					if ( changedCol === undefined ) {
						changedCol = '';
					}
					return '<div id="n-row-indicated-' + row + '" class="n-row-indicated text-center" changed-col="' + changedCol + '"><span class="icon ' + edited + '"></span></div>';
				};

			},

			indicatorRowSelectRenderer: function( gridId ) {
				var $grid = $( gridId );
				$grid.bind( 'rowselect', function( event ) {
					var row = event.args.rowindex;
					$( gridId + " .n-row-indicated" ).each( function() {
						var icon = $( this ).find( "span" );
						if ( icon.hasClass( "icon-edited-white" ) ) {
							icon.removeClass( "icon-edited-white" );
							icon.addClass( "icon-edited" );
						}
					} );
					if ( $( gridId + " #n-row-indicated-" + row + " > span" ).hasClass( "icon-edited" ) ) {
						$( gridId + " #n-row-indicated-" + row + " > span" ).removeClass( "icon-edited" );
						$( gridId + " #n-row-indicated-" + row + " > span" ).addClass( "icon-edited-white" );
					}

					$( gridId + " .grid-checkbox-indicated" ).each( function() {
						var cbId = $( this ).attr( "id" );
						var icon = $( this ).find( "span" );
						if ( cbId.indexOf( row, cbId.length - row.length ) === -1 ) {
							if ( icon.hasClass( "icon-edited-small-white" ) ) {
								icon.removeClass( "icon-edited-small-white" );
								icon.addClass( "icon-edited-small" );
							}
						} else {
							if ( icon.hasClass( "icon-edited-small" ) ) {
								icon.removeClass( "icon-edited-small" );
								icon.addClass( "icon-edited-small-white" );
							}
						}
					} );
				} );
			},

			/*---------------- nokia dropdownlist filter ----------------*/
			dropdownFilterRender: function( column, columnElement, widget ) {
				widget.jqxDropDownList( {
					scrollBarSize: 8,
					placeHolder: "Filter...",
					renderer: function( index, label ) {
						return "<span>" + label + "</span>";
					}
				} );
			},

			dropdownFilterString: {
				filterchoosestring: "Filter..."
			},

			/*---------------- nokia paging render ----------------*/
			pagerrenderer: function( gridId, showPageAndFilter, pagesizeSource ) {
				var $grid = $( gridId );
				var element = $( "<div class=\"page-container\"></div>" );
				var datainfo = $grid.jqxGrid( 'getdatainformation' );
				var paginginfo = datainfo.paginginformation;
				var pagescount = paginginfo.pagescount;

				if ( showPageAndFilter ) {
					appendFilterPageLeft();
					addFilterEvent();
					appendMiddle();
					appendRight( pagesizeSource );
				} else {
					var filterable = $grid.jqxGrid( 'filterable' );
					if ( filterable ) {
						appendFilterPageLeft();
						addFilterEvent();
					} else {
						appendLeft();
						appendMiddle();
						appendRight( pagesizeSource );
					}
				}

				function addFilterEvent() {
					$grid.on( "filter", function() {
						var filterRows = $grid.jqxGrid( 'getrows' );
						var dataRows = $grid.jqxGrid( 'getboundrows' );
						var filterPageLeft = $grid.find( ".n-table-paging-left" );

						if ( dataRows.length === filterRows.length ) {
							filterPageLeft.removeClass( "has-filter" );
							filterPageLeft.addClass( "no-filter" );
						} else {
							filterPageLeft.removeClass( "no-filter" );
							filterPageLeft.addClass( "has-filter" );
							$( filterPageLeft ).find( ".n-table-filter-result span" ).html( filterRows.length );
						}
						setTimeout( recalculateScrollbars, 50 );
					} );
				}

				function appendFilterPageLeft() {
					var totalItem = $( "<span class=\"n-table-paging-left no-filter\"><span class=\"icon icon-filter\"></span><span class=\"n-table-filter-result\">Results: <span></span></span><span>Total: " + datainfo.rowscount + "</span></span>" );
					totalItem.appendTo( element );
				}

				function appendLeft() {
					var totalItem = $( "<span class=\"n-table-paging-left\"><span>Total:" + datainfo.rowscount + "</span></span>" );
					totalItem.appendTo( element );
				}

				function appendMiddle() {
					var centerField = $( "<div class=\"n-table-paging-middle\"></div>" );

					var firstButton = $( "<button class=\"btn btn-icon page-first\" ><span class=\"icon icon-first\"></span></button>" );
					var prevButton = $( "<button class=\"btn btn-icon page-prev\" ><span class=\"icon icon-back\"></span></button>" );

					var pageField = $( "<div class='pageField'></div>" );
					var pageInput = $( "<input type=\"text\" class=\"n-inputfield n-inputfield-small\" />" );
					$( "<span>Page</span>" ).appendTo( pageField );
					pageInput.appendTo( pageField );
					$( "<span>\/ " + pagescount + "</span>" ).appendTo( pageField );


					var nextButton = $( "<button class=\"btn btn-icon page-next\" ><span class=\"icon icon-next\"></span></button>" );
					var lastButton = $( "<button class=\"btn btn-icon page-last\" ><span class=\"icon icon-last\"></span></button>" );

					firstButton.appendTo( centerField );
					prevButton.appendTo( centerField );
					pageField.appendTo( centerField );
					nextButton.appendTo( centerField );
					lastButton.appendTo( centerField );
					centerField.appendTo( element );

					pageInput.val( parseInt( paginginfo.pagenum ) + 1 );

					firstButton.on( 'click', function() {
						$grid.jqxGrid( 'gotopage', 0 );
						setTimeout( recalculateScrollbars, 50 );
					} );

					firstButton.off( 'keydown' ).on( 'keydown', function( e ) {
						if ( e.which === 9 && e.shiftKey ) {
							e.preventDefault();
							var id = $( this ).closest( '.jqx-widget-content' ).attr( 'id' );
							$( '#wrapper' + id ).trigger( 'focus' );
						}
					} );

					prevButton.off( 'click' ).on( 'click', function() {
						$grid.jqxGrid( 'gotoprevpage' );
						setTimeout( recalculateScrollbars, 50 );
					} );

					nextButton.off( 'click' ).on( 'click', function() {
						$grid.jqxGrid( 'gotonextpage' );
						setTimeout( recalculateScrollbars, 50 );
					} );

					lastButton.off( 'click' ).on( 'click', function() {
						$grid.jqxGrid( 'gotopage', pagescount );
						setTimeout( recalculateScrollbars, 50 );
					} );

					pageInput.off( 'change' ).on( 'change', function() {
						goToPage( $( this ).val() );
						setTimeout( recalculateScrollbars, 50 );
					} );

					pageInput.off( 'keydown' ).on( 'keydown', function( event ) {
						if ( event.keyCode === 13 ) {
							goToPage( pageInput.val() );
						}
					} );

					$grid.off( 'pagechanged' ).on( 'pagechanged', function() {
						var datainfo = $grid.jqxGrid( 'getdatainformation' );
						var paginginfo = datainfo.paginginformation;
						pageInput.val( parseInt( paginginfo.pagenum ) + 1 );
						setTimeout( recalculateScrollbars, 50 );
					} );

					function goToPage( inputVal ) {
						var pageIndex = parseInt( inputVal ) - 1;
						$grid.jqxGrid( 'gotopage', pageIndex );
					}
				}

				function appendRight( pagesizeSource ) {
					var perPageField = $( "<div class='n-table-paging-right'></div>" );
					var perPageCombo = $( "<div id=\"" + gridId + "jqxPerPageCombo" + "\"></div>" );
					var index = $grid.jqxGrid( 'pagesize' );
					var pSource = [ 10, 20, 30 ];
					if ( pagesizeSource !== undefined ) {
						pSource = pagesizeSource;
					}
					var selectedIndex = pSource.indexOf( index );
					perPageCombo.jqxComboBox( {
						source: pSource,
						width: 60,
						height: 24,
						selectedIndex: selectedIndex,
						autoDropDownHeight: true,
						enableBrowserBoundsDetection: true,
						renderer: function( index, label ) {
							return "<span>" + label + "</span>";
						}
					} );

					perPageCombo.appendTo( perPageField );
					$( "<span>Items per page</span>" ).appendTo( perPageField );

					perPageField.appendTo( element );

					perPageCombo.on( 'open', function() {
						$( "div[id^='dropdownlistContent'] > input" ).attr( "readonly", "readonly" );
					} );
					perPageCombo.off( 'change' ).on( 'change', function( event ) {
						var args = event.args;
						if ( args ) {
							$grid.jqxGrid( 'pagesize', args.item.originalItem );
						}
						setTimeout( recalculateScrollbars, 50 );
					} );
				}

				return element;
			},

			handlekeyboardnavigation: function( event ) {
				var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;
				if ( key === 9 ) {
					var current = $( event.target );
					if ( current.is( 'body' ) ) {
						return false;
					} else {
						var $grid = current.closest( '.jqx-grid' );
						var gridId = $grid.attr( 'id' );
						var id = current.attr( 'id' );
						var prevItem, nextItem;

						if ( id === gridId || id === 'wrapper' + gridId || id === 'content' + gridId ) {
							if ( $grid.jqxGrid( 'getselectedcell' ) === null && $grid.jqxGrid( 'getselectedrowindex' ) === -1 ) {
								$grid.jqxGrid( 'focus' );
								var columnName = $grid.jqxGrid( "columns" ).records[ 0 ].datafield;
								$grid.jqxGrid( 'selectcell', 0, columnName );
								$grid.jqxGrid( 'selectrow', 0 );
							} else {
								$grid.jqxGrid( 'clearselection' );
								if ( event.shiftKey ) {
									prevItem = $.getPrevTabbale();
									if ( prevItem.attr( 'id' ) === gridId ) {
										prevItem.focus();
									}
									$.tabPrev();
								} else {
									nextItem = $.getNextTabbale();
									if ( nextItem.attr( 'tabindex' ) === '2' ) {
										nextItem.focus();
										$.tabNext();
									} else {
										$.tabNext();
									}
								}
							}
							return true;
						} else {
							if ( event.shiftKey ) {
								prevItem = $.getPrevTabbale();
								id = prevItem.attr( 'id' );
								if ( id === gridId || id === 'wrapper' + gridId || id === 'content' + gridId ) {
									$grid.jqxGrid( 'focus' );
									$grid.jqxGrid( 'selectcell', 0, 'severity' );
									$grid.jqxGrid( 'selectrow', 0 );
									return true;
								}
							}
						}
					}
				}
			},

			enableErrorHeaderRow: function( gridId ) {
				setTimeout( function() {
					var $gridId = '#' + gridId;
					var errorNum = 0;
					var rows = $( $gridId ).jqxGrid( 'getrows' );
					var cols = $( $gridId ).jqxGrid( 'columns' ).records;
					for ( var i = 0; i < rows.length; i++ ) {
						for ( var j = 0; j < cols.length; j++ ) {
							var datafield = cols[ j ].datafield;
							var cellValue = rows[ i ][ datafield ].toString();
							if ( ( cellValue.indexOf( '#errordata#' ) !== -1 && cols[ j ].columntype === 'textbox' ) || ( cols[ j ].columntype === 'NumberInput' && ( cellValue.indexOf( '((' ) === 0 && cellValue.indexOf( '))' ) === cellValue.length - 2 ) ) ) {
								errorNum += 1;
							}
						}
					}
					var gridHeader = $( $gridId ).find( '.jqx-grid-header' );
					gridHeader.children().after( '<div class="grid-error-header">' +
						'<span><span class="icon icon-error"></span>There are ' + errorNum + ' errors in this table.</span>' +
						'</div>' );
					gridHeader.css( 'height', '50px' );
					gridHeader.children().css( 'height', '50%' );
					gridHeader.after( '<div class="grid-error-header-icon"><a href="#"><span class="icon icon-close-rounded"></span></a></div>' );
					$( '.icon-close-rounded' ).parent( 'a' ).on( 'click', function() {
						var gridHeader = $( $gridId ).find( '.jqx-grid-header' );
						gridHeader.css( 'height', '25px' );
						gridHeader.children().css( 'height', '100%' );
						$( $gridId ).find( '.grid-error-header' ).css( 'display', 'none' );
						$( $gridId ).jqxGrid( 'render' );
					} );
				}, 50 );
			},

			enableHeadErrorIndicator: function( gridId ) {
				setTimeout( function() {
					var $gridId = '#' + gridId;
					var rows = $( $gridId ).jqxGrid( 'getrows' );
					var cols = $( $gridId ).jqxGrid( 'columns' ).records;

					var errorsCount = [];
					for ( var x = 0; x < cols.length; x++ ) {
						errorsCount[ x ] = 0;
					}

					for ( var i = 0; i < rows.length; i++ ) {
						for ( var j = 0; j < cols.length; j++ ) {
							var datafield = cols[ j ].datafield;
							var cellValue = rows[ i ][ datafield ].toString();
							if ( ( cellValue.indexOf( '#errordata#' ) !== -1 && cols[ j ].columntype === 'textbox' ) || ( cols[ j ].columntype === 'NumberInput' && ( cellValue.indexOf( '((' ) === 0 && cellValue.indexOf( '))' ) === cellValue.length - 2 ) ) ) {
								errorsCount[ j ] = errorsCount[ j ] + 1;
							}
						}
					}

					var headCount = $( $gridId ).find( '.jqx-grid-column-header' ).length;
					for ( var n = 0; n < headCount; n++ ) {
						var errors = errorsCount[ n ];
						if ( errors > 0 ) {
							$( $gridId ).find( '.jqx-grid-column-header' ).eq( n ).find( 'span' )
								.after( '<span class="icon text-center n-error-indicator">' + errors + '</span>' );
						}
					}
				}, 50 );
			},

			/*-------------- nokia Add/Delete Rows implementation*/
			nDeleteButtonOnCellRenderer: function( row, datafield, value ) {
				return '<div class="n-cell-icon-container">' +
					'<button class="n-cell-icon n-cell-icon-control n-del-row-btn" data-row-index="' + row + '">' +
					'<span class="icon ' + value + '"></span></button></div>';
			},

			nAttachAddRowButton: function( grid, button, row ) {
				$( button ).on( 'click', function() {
					var data = row();
					grid.jqxGrid( 'addrow', null, data );
					setTimeout( recalculateScrollbars, 50 );
				} );
			},

			nAttachDelRowButton: function( grid, button ) {
				$( button ).on( 'click', function() {
					var selectedrowindex = grid.jqxGrid( 'getselectedrowindex' );
					var rowscount = grid.jqxGrid( 'getdatainformation' ).rowscount;
					if ( selectedrowindex >= 0 && selectedrowindex < rowscount ) {
						var id = grid.jqxGrid( 'getrowid', selectedrowindex );
						grid.jqxGrid( 'deleterow', id );
					}
					setTimeout( recalculateScrollbars, 10 );
				} );
			},

			nEnableDeleteButtonOnCell: function( grid ) {
				$( document ).on( 'click', '.n-del-row-btn', function() {
					var index = $( this ).data( "row-index" );
					var id = grid.jqxGrid( 'getrowid', index );
					grid.jqxGrid( 'deleterow', id );
				} );
			}
		};

		$jqxTable.on( 'bindingcomplete', function() {
			$( this ).find( 'div[id^=verticalScrollBar]' ).first().before( '<div class="n-extra-scrollbar-div"></div>' );
			$( this ).jqxGrid( {
				rendered: function() {
					setTimeout( recalculateScrollbars, 50 );
				}
			} );
			var height = $( this ).find( '.jqx-scrollbar' ).first().jqxScrollBar( 'height' );
			$( this ).find( '.jqx-scrollbar' ).first().jqxScrollBar( {
				thumbMinSize: 50
			} );
			if ( $.browser.mozilla ) {
				var contentTable = $( this ).find( 'div[id^=content].jqx-overflow-hidden' );
				contentTable.css( 'height', 'none' );
				contentTable.css( 'height', contentTable.height() - 1 + 'px' );
			}
			setTimeout( recalculateScrollbars, 50 );
		} );

		$jqxTable.on( "filter", function() {
			setTimeout( recalculateScrollbars, 50 );
		} );

		function recalculateScrollbars() {
			$jqxTable.each( function() {
				var verticalScrollbar = $( this ).find( 'div[id^=verticalScrollBar]' ).first();
				var horizontalScrollbar = $( this ).find( 'div[id^=horizontalScrollBar]' ).first();

				verticalScrollbar.css( 'max-height', 'none' );
				if ( horizontalScrollbar.length > 0 ) {
					verticalScrollbar.css( 'max-height', verticalScrollbar.outerHeight() - 39 + 'px' ); //26 - height of extraScrollbarDiv, 12-height of horizontal scrollbar
				} else {
					verticalScrollbar.css( 'max-height', verticalScrollbar.outerHeight() - 26 + 'px' );
				}

				var verticalThumbScrollbar = $( this ).find( 'div[id^=jqxScrollThumbverticalScrollBar]' ).first();
				verticalThumbScrollbar.css( 'max-height', 'none' );
				verticalThumbScrollbar.css( 'max-height', verticalThumbScrollbar.height() - 26 + 'px' );
			} );
		}

		$( document ).ready( function() {
			setTimeout( function() {
				var headerColumns = $( ".jqx-grid-column-header" );
				for ( var i = 0; i < headerColumns.length; i++ ) {
					headerColumns[ i ].onclick = handleColumnHeadSort;
				}

				$( ".jqx-grid" ).each( function() {
					$( this ).on( 'cellselect', function( event ) {
						var gridId = $( this ).attr( 'id' );
						var currentTarget = $( document.activeElement );
						var editComponentId = currentTarget.parent().attr( 'id' );
						if ( currentTarget.attr( 'type' ) === 'checkbox' ) {
							editComponentId = currentTarget.parent().parent().attr( 'id' );
						}
						var dataField = event.args.datafield;
						var rowBoundIndex = event.args.rowindex;
						if ( editComponentId !== undefined &&
							'customeditor' + gridId + dataField + '_' + rowBoundIndex !== editComponentId ) {
							editComponentId = editComponentId.replace( 'customeditor' + gridId, '' );
							var strings = editComponentId.split( '_' );
							$( this ).jqxGrid( 'endcelledit', strings[ 1 ], strings[ 0 ] );
						}
					} );

					$( this ).attr( 'tabindex', '0' );
				} );

				// For filter row jqwDropdown keyboard support.
				$( ".jqx-grid-cell-filter-row .jqx-dropdownlist-state-normal" ).on( "keydown", function( e ) {
					if ( e.which === 32 ) {
						var opened = $( this ).jqxDropDownList( 'isOpened' );
						if ( !opened ) {
							$( this ).jqxDropDownList( 'open' );
						} else {
							$( this ).jqxDropDownList( 'close' );
						}
					}
				} );
			}, 50 );
		} );

		function handleColumnHeadSort() {
			/*jshint validthis:true */
			var columnSortType = $( this ).attr( "aria-sort" );
			if ( columnSortType === "" || columnSortType === undefined ) {
				return;
			}

			var columnHeadTextDiv = $( this ).children( "div" ).children( "div" )[ 0 ];
			var columnAlignType = $( columnHeadTextDiv ).css( "text-align" );

			//add right padding if it is right alignment and is sorting.
			if ( columnAlignType === "right" && ( columnSortType === "ascending" || columnSortType === "descending" ) ) {
				$( columnHeadTextDiv ).css( "padding-right", "18px" );
			} else {
				$( columnHeadTextDiv ).css( "padding-right", "8px" );
			}
		}

		function addChangedCol( row, editorId, gridId ) {
			var $targetCol = $( "#" + gridId + " #n-row-indicated-" + row );
			var changedCol = $targetCol.attr( "changed-col" );
			if ( changedCol === undefined ) {
				changedCol = '';
			}
			if ( changedCol.indexOf( editorId ) === -1 ) {
				changedCol = changedCol + editorId;
				$targetCol.attr( "changed-col", changedCol );
			}
		}

		function removeChangedCol( row, editorId, gridId ) {
			var $targetCol = $( "#" + gridId + " #n-row-indicated-" + row );
			var changedCol = $targetCol.attr( "changed-col" );
			if ( changedCol === undefined ) {
				changedCol = '';
			}
			changedCol = changedCol.replace( editorId, '' );
			$targetCol.attr( "changed-col", changedCol );
			var currentChangedCol = $targetCol.attr( "changed-col" );
			if ( currentChangedCol !== undefined ) {
				if ( currentChangedCol.replace( 'editorId', '' ) === '' ) {
					$( "#" + gridId + " #n-row-indicated-" + row + " > span" ).removeClass( "icon-edited-white" );
				}
			}
		}

		function checkIndicatedByCell( editor ) {
			var gridId = editor.parent().attr( "id" ).replace( "contenttable", "" );
			var tmpColumnName = editor.attr( "id" ).replace( "customeditor" + gridId, "" );
			var columnName = tmpColumnName.substring( 0, tmpColumnName.indexOf( "_" ) );
			var isIndicatedByCell = $( "#" + gridId ).jqxGrid( 'getcolumnproperty', columnName, 'indicator' );
			if ( isIndicatedByCell === undefined ) {
				isIndicatedByCell = false;
			}
			return isIndicatedByCell;
		}

		function handleTabKey( e, editor, row ) {
			if ( e.which === 9 ) {
				e.preventDefault();
				e.stopPropagation();

				var $grid = editor.closest( '.jqx-grid' );
				var editorId = editor.attr( 'id' );
				var columnName = editorId.split( '_' )[ 0 ];
				columnName = columnName.replace( 'customeditor' + $grid.attr( 'id' ), '' );
				var currentIndex = $grid.jqxGrid( 'getcolumnindex', columnName );
				var data = $grid.jqxGrid( 'getrowdata', row );
				var keys = [];
				$.each( data, function( key ) {
					keys.push( key );
				} );
				$grid.jqxGrid( 'selectcell', row, keys[ currentIndex + 1 ] );
			}
		}

		//Hide the up and down button in scroll bar for jqx table
		if ( $.jqx !== undefined ) {
			$.jqx.init( {
				scrollBarButtonsVisibility: "hidden"
			} );
		}

		// GRIDS KEYBOARD ACCESSIBILITY
		// ============================
		$( document )
			.on( 'keydown.wf.grid.keyboard', '.grid-error-header-icon', $.wfKBCore.commonKeyboardHandler )
			.on( 'focusin.wf.grid.keyboard', '.jqx-widget-content', $.wfKBGrid.gridFocusinHandler );

	} )( $ );


	//jquery.mask.js
	( function( $ ) {
		var Mask = function( el, mask, options ) {
			el = $( el );

			var jMask = this,
				oldValue = el.val(),
				regexMask;

			mask = typeof mask === 'function' ? mask( el.val(), undefined, el, options ) : mask;

			var p = {
				invalid: [],
				getCaret: function() {
					try {
						var sel,
							pos = 0,
							ctrl = el.get( 0 ),
							dSel = document.selection,
							cSelStart = ctrl.selectionStart;

						// IE Support
						if ( dSel && navigator.appVersion.indexOf( 'MSIE 10' ) === -1 ) {
							sel = dSel.createRange();
							sel.moveStart( 'character', el.is( 'input' ) ? -el.val().length : -el.text().length );
							pos = sel.text.length;
						}
						// Firefox support
						else if ( cSelStart || cSelStart === '0' ) {
							pos = cSelStart;
						}

						return pos;
					} catch ( e ) {}
				},
				setCaret: function( pos ) {
					try {
						if ( el.is( ':focus' ) ) {
							var range, ctrl = el.get( 0 );

							if ( ctrl.setSelectionRange ) {
								ctrl.setSelectionRange( pos, pos );
							} else if ( ctrl.createTextRange ) {
								range = ctrl.createTextRange();
								range.collapse( true );
								range.moveEnd( 'character', pos );
								range.moveStart( 'character', pos );
								range.select();
							}
						}
					} catch ( e ) {}
				},
				events: function() {
					el
					// SPEC added keydown mask to prevent a lot of illegal characters to show up when key kept down
					// Still it shows the pressed key and erases it in key up if char is illegal - that could be
					// also blocked to get the user experience better - also some message/tooltip should be
					// shown what is the correct input format.
						.on( 'keydown.mask', p.behaviour )
						.on( 'keyup.mask', p.behaviour )
						.on( 'paste.mask drop.mask', function() {
							setTimeout( function() {
								el.keydown().keyup();
							}, 100 );
						} )
						.on( 'change.mask', function() {
							el.data( 'changed', true );
						} )
						.on( 'blur.mask', function() {
							if ( oldValue !== el.val() && !el.data( 'changed' ) ) {
								el.triggerHandler( 'change' );
							}
							el.data( 'changed', false );
						} )
						// it's very important that this callback remains in this position
						// otherwhise oldValue it's going to work buggy
						.on( 'keydown.mask, blur.mask', function() {
							oldValue = el.val();
						} )
						// select all text on focus
						.on( 'focus.mask', function( e ) {
							if ( options.selectOnFocus === true ) {
								$( e.target ).select();
							}
						} )
						// clear the value if it not complete the mask
						.on( 'focusout.mask', function() {
							if ( options.clearIfNotMatch && !regexMask.test( p.val() ) ) {
								p.val( '' );
							}
						} );
				},
				getRegexMask: function() {
					var maskChunks = [],
						translation, pattern, optional, recursive, oRecursive, r;

					for ( var i = 0; i < mask.length; i++ ) {
						translation = jMask.translation[ mask.charAt( i ) ];

						if ( translation ) {

							pattern = translation.pattern.toString().replace( /.{1}$|^.{1}/g, '' );
							optional = translation.optional;
							recursive = translation.recursive;

							if ( recursive ) {
								maskChunks.push( mask.charAt( i ) );
								oRecursive = {
									digit: mask.charAt( i ),
									pattern: pattern
								};
							} else {
								maskChunks.push( !optional && !recursive ? pattern : ( pattern + '?' ) );
							}

						} else {
							maskChunks.push( mask.charAt( i ).replace( /[-\/\\^$*+?.()|[\]{}]/g, '\\$&' ) );
						}
					}

					r = maskChunks.join( '' );

					if ( oRecursive ) {
						r = r.replace( new RegExp( '(' + oRecursive.digit + '(.*' + oRecursive.digit + ')?)' ), '($1)?' )
							.replace( new RegExp( oRecursive.digit, 'g' ), oRecursive.pattern );
					}

					return new RegExp( r );
				},
				destroyEvents: function() {
					el.off( [ 'keydown', 'keyup', 'paste', 'drop', 'blur', 'focusout', '' ].join( '.mask ' ) );
				},
				val: function( v ) {
					var isInput = el.is( 'input' ),
						method = isInput ? 'val' : 'text',
						r;

					if ( arguments.length > 0 ) {
						if ( el[ method ]() !== v ) {
							el[ method ]( v );
						}
						r = el;
					} else {
						r = el[ method ]();
					}

					return r;
				},
				getMCharsBeforeCount: function( index, onCleanVal ) {
					for ( var count = 0, i = 0, maskL = mask.length; i < maskL && i < index; i++ ) {
						if ( !jMask.translation[ mask.charAt( i ) ] ) {
							index = onCleanVal ? index + 1 : index;
							count++;
						}
					}
					return count;
				},
				caretPos: function( originalCaretPos, oldLength, newLength, maskDif ) {
					var translation = jMask.translation[ mask.charAt( Math.min( originalCaretPos - 1, mask.length - 1 ) ) ];

					return !translation ? p.caretPos( originalCaretPos + 1, oldLength, newLength, maskDif ) : Math.min( originalCaretPos + newLength - oldLength - maskDif, newLength );
				},
				behaviour: function( e ) {
					e = e || window.event;
					p.invalid = [];
					var keyCode = e.keyCode || e.which;
					if ( $.inArray( keyCode, jMask.byPassKeys ) === -1 ) {

						var caretPos = p.getCaret(),
							currVal = p.val(),
							currValL = currVal.length,
							changeCaret = caretPos < currValL,
							newVal = p.getMasked(),
							newValL = newVal.length,
							maskDif = p.getMCharsBeforeCount( newValL - 1 ) - p.getMCharsBeforeCount( currValL - 1 );

						p.val( newVal );

						// change caret but avoid CTRL+A
						if ( changeCaret && !( keyCode === 65 && e.ctrlKey ) ) {
							// Avoid adjusting caret on backspace or delete
							if ( !( keyCode === 8 || keyCode === 46 ) ) {
								caretPos = p.caretPos( caretPos, currValL, newValL, maskDif );
							}
							p.setCaret( caretPos );
						}

						return p.callbacks( e );
					}
				},
				getMasked: function( skipMaskChars ) {
					var buf = [],
						value = p.val(),
						m = 0,
						maskLen = mask.length,
						v = 0,
						valLen = value.length,
						offset = 1,
						addMethod = 'push',
						resetPos = -1,
						lastMaskChar,
						check;

					if ( options.reverse ) {
						addMethod = 'unshift';
						offset = -1;
						lastMaskChar = 0;
						m = maskLen - 1;
						v = valLen - 1;
						check = function() {
							return m > -1 && v > -1;
						};
					} else {
						lastMaskChar = maskLen - 1;
						check = function() {
							return m < maskLen && v < valLen;
						};
					}

					while ( check() ) {
						var maskDigit = mask.charAt( m ),
							valDigit = value.charAt( v ),
							translation = jMask.translation[ maskDigit ];

						if ( translation ) {
							if ( valDigit.match( translation.pattern ) ) {
								buf[ addMethod ]( valDigit );
								if ( translation.recursive ) {
									if ( resetPos === -1 ) {
										resetPos = m;
									} else if ( m === lastMaskChar ) {
										m = resetPos - offset;
									}

									if ( lastMaskChar === resetPos ) {
										m -= offset;
									}
								}
								m += offset;
							} else if ( translation.optional ) {
								m += offset;
								v -= offset;
							} else if ( translation.fallback ) {
								buf[ addMethod ]( translation.fallback );
								m += offset;
								v -= offset;
							} else {
								p.invalid.push( {
									p: v,
									v: valDigit,
									e: translation.pattern
								} );
							}
							v += offset;
						} else {
							if ( !skipMaskChars ) {
								buf[ addMethod ]( maskDigit );
							}

							if ( valDigit === maskDigit ) {
								v += offset;
							}

							m += offset;
						}
					}

					var lastMaskCharDigit = mask.charAt( lastMaskChar );
					if ( maskLen === valLen + 1 && !jMask.translation[ lastMaskCharDigit ] ) {
						buf.push( lastMaskCharDigit );
					}

					return buf.join( '' );
				},
				callbacks: function( e ) {
					var val = p.val(),
						changed = val !== oldValue,
						defaultArgs = [ val, e, el, options ],
						callback = function( name, criteria, args ) {
							if ( typeof options[ name ] === 'function' && criteria ) {
								options[ name ].apply( this, args );
							}
						};

					callback( 'onChange', changed === true, defaultArgs );
					callback( 'onKeyPress', changed === true, defaultArgs );
					callback( 'onComplete', val.length === mask.length, defaultArgs );
					callback( 'onInvalid', p.invalid.length > 0, [ val, e, el, p.invalid, options ] );
				}
			};


			// public methods
			jMask.mask = mask;
			jMask.options = options;
			jMask.remove = function() {
				var caret = p.getCaret();
				p.destroyEvents();
				p.val( jMask.getCleanVal() );
				p.setCaret( caret - p.getMCharsBeforeCount( caret ) );
				return el;
			};

			// get value without mask
			jMask.getCleanVal = function() {
				return p.getMasked( true );
			};

			jMask.init = function( onlyMask ) {
				onlyMask = onlyMask || false;
				options = options || {};

				jMask.byPassKeys = $.jMaskGlobals.byPassKeys;
				jMask.translation = $.jMaskGlobals.translation;

				jMask.translation = $.extend( {}, jMask.translation, options.translation );
				jMask = $.extend( true, {}, jMask, options );

				regexMask = p.getRegexMask();

				if ( onlyMask === false ) {

					if ( options.placeholder ) {
						el.attr( 'placeholder', options.placeholder );
					}

					// autocomplete needs to be off. we can't intercept events
					// the browser doesn't  fire any kind of event when something is
					// selected in a autocomplete list so we can't sanitize it.
					el.attr( 'autocomplete', 'off' );
					p.destroyEvents();
					p.events();

					var caret = p.getCaret();
					p.val( p.getMasked() );
					p.setCaret( caret + p.getMCharsBeforeCount( caret, true ) );

				} else {
					p.events();
					p.val( p.getMasked() );
				}
			};

			jMask.init( !el.is( 'input' ) );
		};

		$.maskWatchers = {};
		var HTMLAttributes = function() {
				var input = $( this ),
					options = {},
					prefix = 'data-mask-',
					mask = input.attr( 'data-mask' );

				if ( input.attr( prefix + 'reverse' ) ) {
					options.reverse = true;
				}

				if ( input.attr( prefix + 'clearifnotmatch' ) ) {
					options.clearIfNotMatch = true;
				}

				if ( input.attr( prefix + 'selectonfocus' ) === 'true' ) {
					options.selectOnFocus = true;
				}

				if ( notSameMaskObject( input, mask, options ) ) {
					return input.data( 'mask', new Mask( this, mask, options ) );
				}
			},
			notSameMaskObject = function( field, mask, options ) {
				options = options || {};
				var maskObject = $( field ).data( 'mask' ),
					stringify = JSON.stringify,
					value = $( field ).val() || $( field ).text();
				try {
					if ( typeof mask === 'function' ) {
						mask = mask( value );
					}
					return typeof maskObject !== 'object' || stringify( maskObject.options ) !== stringify( options ) || maskObject.mask !== mask;
				} catch ( e ) {}
			};


		$.fn.mask = function( mask, options ) {
			options = options || {};
			var selector = this.selector,
				globals = $.jMaskGlobals,
				interval = $.jMaskGlobals.watchInterval,
				maskFunction = function() {
					if ( notSameMaskObject( this, mask, options ) ) {
						return $( this ).data( 'mask', new Mask( this, mask, options ) );
					}
				};

			$( this ).each( maskFunction );

			if ( selector && selector !== '' && globals.watchInputs ) {
				clearInterval( $.maskWatchers[ selector ] );
				$.maskWatchers[ selector ] = setInterval( function() {
					$( document ).find( selector ).each( maskFunction );
				}, interval );
			}
			return this;
		};

		$.fn.unmask = function() {
			clearInterval( $.maskWatchers[ this.selector ] );
			delete $.maskWatchers[ this.selector ];
			return this.each( function() {
				var dataMask = $( this ).data( 'mask' );
				if ( dataMask ) {
					dataMask.remove().removeData( 'mask' );
				}
			} );
		};

		$.fn.cleanVal = function() {
			return this.data( 'mask' ).getCleanVal();
		};

		$.applyDataMask = function( selector ) {
			selector = selector || $.jMaskGlobals.maskElements;
			var $selector = ( selector instanceof $ ) ? selector : $( selector );
			$selector.filter( $.jMaskGlobals.dataMaskAttr ).each( HTMLAttributes );
		};

		var globals = {
			maskElements: 'input,td,span,div',
			dataMaskAttr: '*[data-mask]',
			dataMask: true,
			watchInterval: 300,
			watchInputs: true,
			watchDataMask: false,
			byPassKeys: [ 9, 16, 17, 18, 36, 37, 38, 39, 40, 91 ],
			translation: {
				0: {
					pattern: /\d/
				},
				9: {
					pattern: /\d/,
					optional: true
				},
				'#': {
					pattern: /\d/,
					recursive: true
				},
				A: {
					pattern: /[a-zA-Z0-9]/
				},
				S: {
					pattern: /[a-zA-Z]/
				}
			}
		};

		$.jMaskGlobals = $.jMaskGlobals || {};
		globals = $.jMaskGlobals = $.extend( true, {}, globals, $.jMaskGlobals );

		// looking for inputs with data-mask attribute
		if ( globals.dataMask ) {
			$.applyDataMask();
		}


		//remove this for unit test delay issue
		//setInterval(function(){
		//    if ($.jMaskGlobals.watchDataMask) { $.applyDataMask(); }
		//}, globals.watchInterval);


	} )( $ );


	//list-group.js
	( function( $ ) {

		$( document ).on( "click", ".n-list-group-item", function() {
			var listGroupParent = $( this ).parents( ".n-list-group" );
			if ( !listGroupParent.hasClass( 'disabled' ) ) {
				listGroupParent.find( ".n-list-group-item" ).removeClass( "selected" );
				$( this ).addClass( "selected" );
			}
		} );

		$( document ).ready( function() {
			var listGroup = $( "ul.n-list-group" );
			$.each( listGroup, function() {
				if ( !$( this ).hasClass( "disabled" ) ) {
					$( this ).find( ".n-list-group-item" ).attr( "tabindex", 0 );
					//$(this).find(".n-list-group-item").bind("click", function () {
					//    $(this).parents(".n-list-group").find(".n-list-group-item").removeClass("selected");
					//    $(this).addClass("selected");
					//});
				}
			} );

			var descriptionListGroup = $( "dl.n-list-group" );
			$.each( descriptionListGroup, function() {
				if ( !$( this ).hasClass( "disabled" ) ) {
					$( this ).find( "dd" ).attr( "tabindex", 0 );
					$( this ).find( "dd" ).bind( "click", function() {
						$( this ).parents( ".n-list-group" ).find( "dd" ).removeClass( "selected" );
						$( this ).addClass( "selected" );
					} );
				}
			} );

			var listScrollGroup = $( "ul.n-list-group-scroll" );
			$.each( listScrollGroup, function() {

				if ( $( this ).hasClass( "disabled" ) ) {
					$( this ).nScrollbar( {
						alwaysShowScrollbar: 2,
						theme: "disabled",
						mouseWheel: {
							enable: false
						}
					} );

					$( this ).nScrollbar( "disable" );
				} else {
					$( this ).nScrollbar();
				}
			} );

			var descriptionListScrollGroup = $( "dl.n-list-group-scroll" );
			$.each( descriptionListScrollGroup, function() {

				if ( $( this ).hasClass( "disabled" ) ) {

					$( this ).nScrollbar( {
						alwaysShowScrollbar: 2,
						theme: "disabled",
						mouseWheel: {
							enable: false
						}
					} );

					$( this ).nScrollbar( "disable" );
				} else {
					$( this ).nScrollbar();
				}
			} );

			/**---multicolumn list functions-----**/

			$( ".n-multicolumn-list" ).each( function() {
				var lastSubheader = $( this ).find( ".subheader:last" );
				var lastSubheaderItem = $( this ).find( ".subheader-item:last" );
				if ( lastSubheaderItem.next().length === 0 ) {
					lastSubheader.addClass( "last" );
				}
			} );

			$( ".n-multicolumn-list th" ).each( function() {
				addBoldBufferWidth( $( this ) );
			} );


			$( ".n-multicolumn-list tbody:not(.group) td, th, .n-multicolumn-list tbody.group" )
				.prop( "tabIndex", 0 )
				.off( 'keydown mouseup' ).on( 'keydown mouseup', function( event ) {
					if ( event.type === 'mouseup' || event.keyCode === 13 || event.keyCode === 32 ) {
						event.preventDefault();
						$( this ).closest( ".n-multicolumn-list" ).find( '.selected' ).removeClass( 'selected' );
						$( this ).toggleClass( 'selected' );
					}
				} );

			$( ".n-multicolumn-list .subheader" ).off( 'keydown mouseup' ).on( 'keydown mouseup', function( event ) {
				if ( event.type === 'mouseup' || event.keyCode === 13 || event.keyCode === 32 ) {
					$( this ).toggleClass( 'open' );
					$( this ).find( 'span.icon' ).toggleClass( 'icon-next' );
					$( this ).find( 'span.icon' ).toggleClass( 'icon-arrow' );
					$( this ).nextUntil( 'tr:not(.subheader-item)' ).toggleClass( 'open' );

					if ( $( this ).parent().find( ".subheader:last" ).is( $( this ) ) && $( this ).parent().children( 'tr:last' ).hasClass( 'subheader-item' ) ) {
						$( this ).toggleClass( "last" );
					}
				}
			} );


		} );

		function addBoldBufferWidth( element ) {
			var wid = element.width();
			var normalBuffer = 16;
			var selectedBuffer = 14;

			if ( element.hasClass( 'selected' ) ) {
				wid += selectedBuffer;
			} else {
				wid += normalBuffer;
			}
			element.css( 'width', wid + 'px' );
		}

		// LIST GROUP KEYBOARD ACCESSIBILITY
		// =================================
		$( document ).on( 'keydown.wf.listgroup.keyboard', '.n-list-group', $.wfKBCore.commonKeyboardHandler );

	} )( $ );


	//localized-navigation.js
	( function( $ ) {

		$( document ).ready( function() {
			/* Adds buffer width for bold style to prevent unnecessary movement of items*/
			$( '.nav-local-menu li' ).each( function() {
				addBoldBufferWidth( $( this ) );
			} );

			$( '.nav-local-menu-divided li' ).each( function() {
				addBoldBufferWidth( $( this ) );
			} );
		} );

		$( '.nav-local' ).on( 'click', 'li', function() {
			$( this ).siblings( 'li' ).removeClass( 'selected' );
			$( this ).addClass( 'selected' );
		} );

		function addBoldBufferWidth( element ) {
			var wid = element.width();
			var normalBuffer = 3;
			var selectedBuffer = 1;

			if ( element.hasClass( 'selected' ) ) {
				wid += selectedBuffer;
			} else {
				wid += normalBuffer;
			}

			element.css( 'width', wid + 'px' );
		}

	} )( $ );


	//navbar.js
	( function( $ ) {

		/*--------------- start module scope variables ---------------*/
		var nBannerLinksCollapse = $( ".n-banner-links-collapse" );
		var nBannerTabs = $( ".n-banner-tabs" );
		var KEY = {
			up: 38,
			down: 40,
			right: 39,
			left: 37,
			space: 32,
			enter: 13
		};

		// variables used in responsiveness
		var bannerBlueDetachEvent = "n.banner.blue.block.detached";
		var bannerBlueAttachEvent = "n.banner.blue.block.attached";
		var $bannersInPage = $( ".n-banner" );
		var CSSSelectorMap = {
			collapseDropdownMenu: ".n-banner-links-collapse-dropdown-menu > .dropdown",
			bannerRightDropdown: ".n-banner-links .dropdown",
			navSecondHoverItem: ".nav-secondary-horizontal li",
			dropdownItemHasChild: ".n-dropdown-menu-item-has-child",
			navLinksDetachedClass: "dropdown-menu n-banner-links-collapse-dropdown-menu",
			navLinksAttatchedClass: "nav n-banner-nav n-banner-links",
			navDropdownLinksDetachedClass: "dropdown-menu n-banner-dropdown-links-collapse-dropdown-menu",
			navDropdownLinksAttatchedClass: "nav n-banner-nav n-banner-dropdown-links",

			attachNavLinks: ".n-banner-2nd .n-banner-links-collapse-dropdown-menu",
			attachNavDropdownLinks: ".n-banner-2nd .n-banner-dropdown-links-collapse-dropdown-menu",
			attachNavLinksSubmenu: ".n-banner-2nd .n-banner-links-collapse .dropdown .dropdown-menu.n-collapse-dropdown-sub-menu",

			DetachedNavLinks: ".n-banner-2nd .n-banner-links",
			DetachedNavDropdownLinks: ".n-banner-2nd .n-banner-dropdown-links",
			DetachedNavLinksSubmenu: ".n-banner-2nd .n-banner-links-collapse .dropdown .dropdown-menu"
		};
		/*--------------- end module scope variables ----------------*/


		/*--------------- start utility methods ---------------*/
		/*--------------- end utility methods ---------------*/


		/*--------------- start dom methods ---------------*/
		//loop through every banner on the page
		function triggerCollapseBanner() {
			$bannersInPage.each( function() {
				var $banner = $( this );
				var compensation = 30;
				var bannerToggle = $banner.find( ".n-banner-toggle" );
				//blue part offset on the top banner
				var offsetUpBlue = $banner.find( '.n-banner-1st-blue-to-gray' ).position().left + $banner.find( '.n-banner-1st-blue-to-gray .blue-corner' ).width() - compensation;
				//grey part width in the bottom
				var $navTabDown = $banner.find( '.n-banner-2nd .n-banner-tabs' );
				//grey part off set in the bottom banner
				var offsetDownGray = $navTabDown.width();
				var breakPointState = $banner.attr( "data-visual-break" );
				if ( breakPointState === undefined ) {
					if ( offsetUpBlue < offsetDownGray ) {
						$banner.trigger( bannerBlueDetachEvent );
					} else {
						$banner.trigger( bannerBlueAttachEvent );
					}
				} else if ( breakPointState === "true" && offsetUpBlue > offsetDownGray && typeof bannerToggle !== "undefined" && $( bannerToggle ).css( "display" ) === "none" ) {
					$banner.trigger( bannerBlueAttachEvent );
				} else if ( breakPointState === "false" && offsetUpBlue < offsetDownGray ) {
					$banner.trigger( bannerBlueDetachEvent );
				}
			} );
		}

		//elements mark to be hidden on blue detached event in the banner
		function toggleVisibleBlocksWhenBlueDetached( parameters ) {
			var $banner = parameters.$banner;
			var detach = parameters.detach;
			var hiddenOnBlueDetach = $banner.find( '.hidden-on-blue-detached' );
			var showOnBlueDetach = $banner.find( '.show-on-blue-detached' );
			var overflowCover = $banner.find( '.overflow-toggle-area-cover' );
			if ( detach ) {
				hiddenOnBlueDetach.hide();
				showOnBlueDetach.show();
				overflowCover.show();
			} else {
				hiddenOnBlueDetach.show();
				showOnBlueDetach.hide();
				overflowCover.hide();
			}
		}

		function bannerBlueBlockDetached() {
			/*jshint validthis:true */
			var $banner = $( this );
			$banner.attr( "data-visual-break", true );
			toggleVisibleBlocksWhenBlueDetached( {
				$banner: $banner,
				detach: true
			} );

			//rightmost tab need to hide
			var navTabDownRightmostTab = $banner.find( '.n-banner-2nd .rightmost-tab' );
			navTabDownRightmostTab.removeClass( 'rightmost-tab' ).addClass( 'rightmost-tab-disabled' );

			//transform style for nav links
			var navLinks = $banner.find( CSSSelectorMap.DetachedNavLinks );
			var navDropdownLinks = $banner.find( CSSSelectorMap.DetachedNavDropdownLinks );
			navDropdownLinks.find( 'li.dropdown' ).each( function() {
				$banner.addClass( 'n-dropdown-menu-item-has-child' );
			} );
			navDropdownLinks.find( 'ul.dropdown-menu' ).each( function() {
				$banner.addClass( 'n-dropdown-sub-menu' );
			} );
			navLinks.removeClass( CSSSelectorMap.navLinksAttatchedClass ).addClass( CSSSelectorMap.navLinksDetachedClass );
			navDropdownLinks.removeClass( CSSSelectorMap.navDropdownLinksAttatchedClass ).addClass( CSSSelectorMap.navDropdownLinksDetachedClass );

			//add class for showing dropdown correctly
			var navLinksSubmenu = $banner.find( CSSSelectorMap.DetachedNavLinksSubmenu );
			navLinksSubmenu.addClass( 'n-collapse-dropdown-sub-menu' );
		}

		function bannerBlueBlockAttached() {
			/*jshint validthis:true */
			var $banner = $( this );
			$banner.attr( "data-visual-break", false );
			toggleVisibleBlocksWhenBlueDetached( {
				$banner: $banner,
				detach: false
			} );

			//rightmost tab need to show
			var navTabDownRightmosTab = $banner.find( '.n-banner-2nd .rightmost-tab-disabled' );
			navTabDownRightmosTab.removeClass( 'rightmost-tab-disabled' ).addClass( 'rightmost-tab' );

			//transform style for nav links
			var navLinks = $banner.find( CSSSelectorMap.attachNavLinks );
			var navDropdownLinks = $banner.find( CSSSelectorMap.attachNavDropdownLinks );
			navDropdownLinks.find( 'li.dropdown' ).each( function() {
				$banner.removeClass( 'n-dropdown-menu-item-has-child' );
			} );
			navDropdownLinks.find( 'ul.dropdown-menu' ).each( function() {
				$banner.removeClass( 'n-dropdown-sub-menu' );
			} );
			navLinks.removeClass( CSSSelectorMap.navLinksDetachedClass ).addClass( CSSSelectorMap.navLinksAttatchedClass );
			navDropdownLinks.removeClass( CSSSelectorMap.navDropdownLinksDetachedClass ).addClass( CSSSelectorMap.navDropdownLinksAttatchedClass );

			//remove class
			var navLinksSubmenu = $banner.find( CSSSelectorMap.attachNavLinksSubmenu );
			navLinksSubmenu.removeClass( 'n-collapse-dropdown-sub-menu' );
		}

		//show or hide menu function
		var showSubMenu = function( $parent ) {
			var parentMenuWidth = $parent.parent( "ul" ).innerWidth();
			var $subMenu = $parent.children( ".n-dropdown-sub-menu" );
			if ( parentMenuWidth < ( $parent.closest( ".n-banner" ).width() - $parent.offset().left ) ) {
				$subMenu.css( "left", parentMenuWidth + "px" );
			} else {
				$subMenu.css( "left", "-" + $subMenu.innerWidth() + "px" );
			}
			hideSubMenu( $parent.siblings( "li.n-dropdown-menu-item-has-child" ).children( ".n-dropdown-sub-menu.open" ) );
			$subMenu.addClass( "open" );
			$parent.children( 'a' ).addClass( "n-dropdown-sub-menu-parent-active" );
		};
		var hideSubMenu = function( $subMenu ) {
			$subMenu.css( "left", "auto" );
			$subMenu.removeClass( "open" );
			$subMenu.siblings( 'a' ).removeClass( "n-dropdown-sub-menu-parent-active" );
		};
		var setSubMenuItemFocus = function( $item, isUpMove ) {
			$item.siblings( "li" ).children( "a" ).blur();
			var prevItem = isUpMove ? $item.prev( "li" ) : $item.next( "li" );
			if ( prevItem.length === 0 ) {
				prevItem = isUpMove ? $item.parent().children( "li" ).last() : $item.parent().children( "li" ).first();
			}
			prevItem.children( "a" ).focus();
		};

		var showCollapsedSubMenu = function( $parent ) {
			var parentMenuWidth = $parent.parent( "ul" ).innerWidth();
			var $subMenu = $parent.children( ".n-collapse-dropdown-sub-menu" );
			if ( parentMenuWidth < ( $parent.closest( ".n-banner" ).width() - $parent.offset().left ) ) {
				$subMenu.css( "left", parentMenuWidth + "px" );
			} else {
				var subMenuPos = $subMenu.innerWidth() + 2;
				$subMenu.css( "left", "-" + subMenuPos + "px" );
			}

			$parent.addClass( "open" );
			$parent.children( 'a' ).eq( 0 ).addClass( "n-dropdown-sub-menu-parent-active" );
		};
		var hideCollapsedSubMenu = function( $parent ) {
			$parent.children( ".n-collapse-dropdown-sub-menu" ).css( "left", "auto" );
			$parent.removeClass( "open" );
			$parent.children( 'a' ).eq( 0 ).removeClass( "n-dropdown-sub-menu-parent-active" );

		};
		var bannerThirdLevelControl = function() {
			var div = $( this ).find( "div" );
			if ( !div.hasClass( "n-banner-overflow-control" ) ) {
				$( ".n-banner-3rd-filler-gray" ).hide();
				$( ".n-banner-3rd" ).find( ".n_banner_3rd_subItem" ).hide();
			}

			if ( $( this ).hasClass( "n-banner-3Link" ) ) {
				var id = $( this ).find( "a" ).data( "item" );
				$( ".n-banner-3rd-filler-gray" ).show();
				$( ".n-banner-3rd" ).show();
				$( "#" + id ).show();
			}
		};
		/*--------------- end dom methods ---------------*/


		/*--------------- start event handlers ----------*/
		$bannersInPage.on( bannerBlueDetachEvent, bannerBlueBlockDetached ).on( bannerBlueAttachEvent, bannerBlueBlockAttached );
		nBannerTabs.on( "mouseover", CSSSelectorMap.dropdownItemHasChild, function() {
			showSubMenu( $( this ) );
		} );
		nBannerTabs.on( "mouseleave", CSSSelectorMap.dropdownItemHasChild, function() {
			hideSubMenu( $( this ).children( ".n-dropdown-sub-menu" ) );
		} );

		// add key event to show or close sub menu
		nBannerTabs.on( "keydown", CSSSelectorMap.dropdownItemHasChild, function( event ) {
			// click right arrow, open sub menu;
			if ( event.keyCode === KEY.right ) {
				var $subMenu = $( this ).children( ".n-dropdown-sub-menu" );
				if ( !$subMenu.hasClass( "open" ) ) {
					showSubMenu( $( this ) );
					$( this ).blur();
					$subMenu.children( "li" ).first().children( "a" ).focus();
				}
			}
		} );
		nBannerTabs.on( "click", ".n-banner-dropdown-toggle", function() {
			var nDropdownSubmenuOpen = nDropdownSubmenuOpen || $( ".n-dropdown-sub-menu.open" );
			if ( nDropdownSubmenuOpen.length !== 0 ) {
				nDropdownSubmenuOpen.removeClass( "open" );
				nDropdownSubmenuOpen.siblings( 'a' ).removeClass( "n-dropdown-sub-menu-parent-active" );
			}
		} );
		nBannerTabs.on( "click", ".dropdown-menu>li", function() {
			$( this ).parent().find( "li" ).removeClass( "active" );
			$( this ).addClass( "active" );
			if ( !$( this ).parent().hasClass( "open" ) ) {
				$( this ).closest( ".dropdown" ).find( "a" ).first().focus();
			}
		} );

		// add key event to move focus of sub menu item
		nBannerTabs.on( "keydown", ".n-dropdown-sub-menu>li", function( event ) {
			event.stopPropagation();
			// click up arrow
			if ( event.keyCode === KEY.up ) {
				setSubMenuItemFocus( $( this ), true );
			}
			// click down arrow
			else if ( event.keyCode === KEY.down ) {
				setSubMenuItemFocus( $( this ), false );
			}
			// click left arrow, close sub menu;
			else if ( event.keyCode === KEY.left ) {
				var $subMenu = $( this ).parent( ".n-dropdown-sub-menu" );
				hideSubMenu( $subMenu );
				$subMenu.prev( "a" ).focus();
			}
		} );
		nBannerTabs.on( "focus", ">li>a", function() {
			var $this = $( this );
			var parentLi = $this.closest( "li" );
			parentLi.siblings( "li" ).removeClass( "active" );
			parentLi.addClass( "active" );
			var barGrayToBlue = parentLi.closest( ".n-banner-tabs" ).siblings( ".n-banner-2nd-gray-to-blue" );
			if ( barGrayToBlue.length > 0 ) {
				if ( parentLi.hasClass( "rightmost-tab" ) ) {
					barGrayToBlue.addClass( "active" );
				} else {
					barGrayToBlue.removeClass( "active" );
				}
			}
		} );
		nBannerTabs.on( 'keydown', "li", function( e ) {
			if ( e.keyCode === KEY.space || e.keyCode === KEY.enter ) {
				e.preventDefault();
				e.stopPropagation();
				$( e.target )[ 0 ].click(); //$(e.target).trigger('click');
				bannerThirdLevelControl.call( this );
			}
		} );

		// hide all sub menu
		$( document ).on( 'click.bs.dropdown.data-api', function() {
			var nDropdownSubmenuOpen = nDropdownSubmenuOpen || $( ".n-dropdown-sub-menu.open" );
			if ( nDropdownSubmenuOpen.length !== 0 ) {
				nDropdownSubmenuOpen.removeClass( "open" );
				nDropdownSubmenuOpen.siblings( 'a' ).removeClass( "n-dropdown-sub-menu-parent-active" );
			}
		} );

		//Secondary Navigation Horizontal
		$( document ).on( 'click', CSSSelectorMap.navSecondHoverItem, function( e ) {
			var $this = $( this );
			$( CSSSelectorMap.navSecondHoverItem ).removeClass( 'selected' );
			if ( !$this.hasClass( 'selected' ) ) {
				$this.addClass( 'selected' );
			}
			e.preventDefault();
		} );
		$( document ).on( 'scroll', function() {
			if ( $( this ).scrollTop() ) {
				$( '.n-banner-secondary-row' ).addClass( 'n-banner-secondary-row-scrolled' );
			} else {
				$( '.n-banner-secondary-row' ).removeClass( 'n-banner-secondary-row-scrolled' );
			}
		} );

		//Adjust Banner menu item alignment
		$( document ).on( 'show.bs.dropdown', CSSSelectorMap.bannerRightDropdown, function() {
			if ( $( this ).offset().left + $( this ).children( "ul" ).eq( 0 ).width() > $( window ).width() ) {
				$( this ).addClass( "pull-right" );
			} else {
				$( this ).removeClass( "pull-right" );
			}
		} );

		//update the info of 3rd nav
		nBannerTabs.on( 'click', "li", function() {
			bannerThirdLevelControl.call( this );
		} );
		$( ".n_banner_3rd_subItem" ).on( "focus", ">li>a", function() {
			var $this = $( this );
			var parentLi = $this.closest( "li" );
			parentLi.siblings( "li" ).removeClass( "active" );
			parentLi.addClass( "active" );
		} );
		//collapsed banner toggle
		nBannerLinksCollapse.on( "mouseover", CSSSelectorMap.collapseDropdownMenu, function() {
			showCollapsedSubMenu( $( this ) );
		} );
		nBannerLinksCollapse.on( "mouseleave", CSSSelectorMap.collapseDropdownMenu, function() {
			hideCollapsedSubMenu( $( this ) );
		} );
		/*--------------- end event handlers ----------*/


		/*--------------- start public methods ----------*/
		/*--------------- end public methods ----------*/


		/*-------------- start common event bind ----------*/
		// responsive banner behavior when blue areas in 2 rows are detached
		$( document ).ready( triggerCollapseBanner );
		$( window ).resize( triggerCollapseBanner );
		/*-------------- end common event bind ----------*/

		// BANNER KEYBOARD ACCESSIBILITY
		// =============================
		$( document ).on( 'keydown.wf.banner.keyboard', '.n-banner-tabs li', $.wfKBCore.commonKeyboardHandler );

	} )( $ );


	//panels.js
	( function( $ ) {

		$.fn.extend( {
			slideToggleVertical: function( options ) {
				var $slideBar = $( this );
				var currentImg = $slideBar.find( ".icon" );
				var speed = 500;
				var isOpen = options && options.isOpen;
				var panelBody = $slideBar.parent().find( ".panel-body" );
				speed = options && options.speed;
				if ( isOpen ) {
					$( panelBody ).css( "display", "block" );
					currentImg.removeClass( 'icon-right' ).addClass( "icon-down" );
				} else {
					$( panelBody ).css( "display", "none" );
					currentImg.removeClass( 'icon-down' ).addClass( "icon-right" );
				}
				$slideBar.click( function() {
					panelBody.slideToggle( speed, function() {
						if ( panelBody.is( ":visible" ) ) {
							currentImg.removeClass( 'icon-right' ).addClass( "icon-down" );
						} else {
							currentImg.removeClass( 'icon-down' ).addClass( "icon-right" );
						}
					} );
				} );
			},
			slideToggleHorizontal: function( options ) {
				var isLeftOpen = options && options.isLeftOpen;
				var leftWidth = options && options.leftWidth;
				var $span = $( this );
				var parentLeft = $span.parent();
				var parentRight = parentLeft.parent().find( ".panel-right" );
				var panelBody = parentLeft.find( ".panel .panel-body" );
				var parent = $span.parent().find( ".panel" );
				var currentImg = $span.find( "span" );
				var myLeftWidth = typeof( leftWidth ) === "undefined" ? 30 : leftWidth;
				var myLeftOpen = typeof( isLeftOpen ) === "undefined" ? true : isLeftOpen;
				if ( myLeftOpen ) {
					parentLeft.css( {
						width: myLeftWidth + "%"
					} );
					parentRight.css( {
						width: "calc(" + ( 100 - myLeftWidth ) + "% - " + "20px)",
						"margin-left": "20px"
					} );
					parentLeft.addClass( "panel-shadow" );
					parentLeft.find( "div" ).each( function() {
						$( this ).show();
					} );
					$span.css( {
						'border-top-left-radius': '0px',
						'border-bottom-left-radius': '0px'
					} );
					parentRight.addClass( "open" );
					currentImg.removeClass( 'icon-right' ).addClass( 'icon-left' );
				} else {
					parentLeft.css( {
						width: "0"
					} );
					parentRight.css( {
						width: "calc(100% - 40px)",
						'margin-left': '40px'
					} );
					$( parent ).find( "div" ).each( function() {
						$( this ).hide();
					} );
					parentLeft.removeClass( "panel-shadow" );
					$span.css( {
						'border-top-left-radius': '7px',
						'border-bottom-left-radius': '7px'
					} );
					currentImg.removeClass( 'icon-left' ).addClass( 'icon-right' );
				}
				$span.click( function() {
					var currentArrow = $( this );
					if ( panelBody.is( ":visible" ) ) {

						var leftWidth = parentLeft.width();
						var rightWidth = parentRight.width();
						parentLeft.removeClass( "panel-shadow" );
						parentLeft.animate( {
							width: 0
						}, "show", function() {
							$( parent ).find( "div" ).each( function() {
								$( this ).hide();
							} );
							currentArrow.css( {
								'border-top-left-radius': '7px',
								'border-bottom-left-radius': '7px'
							} );
							currentImg.removeClass( 'icon-left' ).addClass( 'icon-right' );
						} );
						var current = leftWidth + rightWidth - 20;
						parentRight.animate( {
							width: current + "px",
							'margin-left': '40px'
						} );

					} else {
						parentLeft.find( "div" ).each( function() {
							$( this ).show();
						} );
						parentRight.css( {
							width: "calc(" + ( 100 - myLeftWidth ) + "% - " + "20px)",
							"margin-left": "20px"
						} );
						parentLeft.animate( {
							width: myLeftWidth + "%"
						}, "show", function() {
							parentLeft.addClass( "panel-shadow" );
							currentArrow.css( {
								'border-top-left-radius': '0px',
								'border-bottom-left-radius': '0px'
							} );
						} );
						currentImg.removeClass( 'icon-right' ).addClass( 'icon-left' );
					}
				} );
			}
		} );

		// PANEL KEYBOARD ACCESSIBILITY
		// ============================
		var UP_KEY = 38;
		var DOWN_KEY = 40;

		$( document ).on( 'keydown.wf.panel.keyboard', '.panel-heading', {
				notSupport: [ UP_KEY, DOWN_KEY ]
			}, $.wfKBCore.commonKeyboardHandler )
			.on( 'keydown.wf.panel.keyboard', '.panel-arrow', {
				notSupport: [ UP_KEY, DOWN_KEY ]
			}, $.wfKBCore.commonKeyboardHandler );

	} )( $ );


	//popover.js
	( function( $ ) {

		//toggle all opened popover except the one the click is triggered on.
		$( document ).on( 'click.wf.balloon', function( e ) {
			$( '[data-toggle^="popover"]' ).each( function( idx, el ) {
				if ( e.target !== el ) {
					var popover = $( this ).data( 'bs.popover' );
					var $tip = popover.tip();
					if ( $tip.hasClass( 'in' ) ) {
						$( this ).triggerHandler( 'click.popover' );
					}
				}
			} );
		} );
		$( '.n-hover-popover' ).on( 'mouseover.wf.balloon', function() {
			$( this ).off( 'click' );
			$( this ).data( 'bs.popover' ).show();
		} ).on( 'mouseout.wf.balloon', function() {
			$( this ).data( 'bs.popover' ).hide();
		} );

		//stop propagation if click is triggered on tips
		$( '[data-toggle^="popover"]' ).one( 'shown.bs.popover', function() {
			$( this ).data( 'bs.popover' ).tip().on( 'click.wf.balloon', function( e ) {
				e.stopPropagation();
			} );
		} );

		// resize windown reposition the popover
		// TODO:Jonathan, the resize events should be throttled.
		$( window ).on( 'resize', function() {
			$( '[data-toggle^="popover"]' ).each( function() {
				var popover = $( this ).data( 'bs.popover' );
				var $tip = popover.tip();
				if ( $tip.hasClass( 'in' ) ) {
					popover.show();
				}
			} );
		} );

		$( document )
			.on( 'keydown.wf.balloon.keyboard', 'a[data-toggle=balloon]', $.wfKBCore.commonKeyboardHandler );

	} )( $ );


	//radiogroup.js
	( function( $ ) {

		var ENTER_KEY = 13;
		var LEFT_KEY = 37;
		var RIGHT_KEY = 39;
		var UP_KEY = 38;
		var DOWN_KEY = 40;

		$.fn.radioButtonFocus = function() {
			var groups = [];

			// group the inputs by name
			$( this ).each( function() {
				var el = this;
				var thisGroup = groups[ el.name ] = ( groups[ el.name ] || [] );
				thisGroup.push( el );
			} );

			$( this ).on( 'keydown', function( e ) {
				var isCtrlKey = ( window.event && window.event.ctrlKey ) || e.ctrlKey;
				if ( isCtrlKey && ( e.keyCode === LEFT_KEY || e.keyCode === UP_KEY || e.keyCode === RIGHT_KEY || e.keyCode === DOWN_KEY ) ) {
					e.preventDefault();
				}

				setTimeout( function() {
					var el = e.target;
					var thisGroup = groups[ el.name ] = ( groups[ el.name ] || [] );
					var indexOfTarget = thisGroup.indexOf( e.target );
					var nextIndex = 0;

					if ( ( e.keyCode === LEFT_KEY || e.keyCode === UP_KEY ) && isCtrlKey ) {
						if ( indexOfTarget > 0 ) {
							nextIndex = indexOfTarget - 1;
						} else {
							nextIndex = thisGroup.length - 1;
						}
						while ( $( thisGroup[ nextIndex ] ).is( ':disabled' ) ) {
							if ( nextIndex > 0 ) {
								nextIndex = nextIndex - 1;
							} else {
								nextIndex = thisGroup.length - 1;
							}
						}
						thisGroup[ nextIndex ].focus();
					}
					if ( ( e.keyCode === RIGHT_KEY || e.keyCode === DOWN_KEY ) && isCtrlKey ) {
						if ( indexOfTarget < ( thisGroup.length - 1 ) ) {
							nextIndex = indexOfTarget + 1;
						} else {
							nextIndex = 0;
						}
						while ( $( thisGroup[ nextIndex ] ).is( ':disabled' ) ) {
							if ( nextIndex < ( thisGroup.length - 1 ) ) {
								nextIndex = nextIndex + 1;
							} else {
								nextIndex = 0;
							}
						}
						thisGroup[ nextIndex ].focus();
					}
					if ( e.keyCode === ENTER_KEY ) {
						el.checked = true;
					}
				} );
			} );
		};

		$( document ).ready( function() {
			$( '.n-radio-btn' ).radioButtonFocus();
		} );


	} )( $ );


	//resize.js
	( function( $ ) {

		var Resizable = function( el ) {
			el = $( el );
			var resizeObject = this;

			resizeObject.init = function() {
				var p = $( el ).get( 0 );
				var resizer = document.createElement( 'div' );
				resizer.style.width = '10px';
				resizer.style.height = '10px';
				resizer.style.position = 'absolute';
				resizer.style.right = 0;
				resizer.style.bottom = 0;
				resizer.style.cursor = 'se-resize';
				resizer.className = 'resizer';
				p.className = p.className + ' resizable';
				p.appendChild( resizer );
				resizer.addEventListener( 'mousedown', initResize, false );

				var startX, startY, startWidth, startHeight;

				function initResize( e ) {
					startX = e.clientX;
					startY = e.clientY;
					startWidth = parseInt( document.defaultView.getComputedStyle( p, null ).width, 10 );
					startHeight = parseInt( document.defaultView.getComputedStyle( p, null ).height, 10 );
					document.documentElement.addEventListener( 'mousemove', doResize, false );
					document.documentElement.addEventListener( 'mouseup', stopResize, false );
				}

				function doResize( e ) {
					p.style.width = ( startWidth + e.clientX - startX ) + 'px';
					p.style.height = ( startHeight + e.clientY - startY ) + 'px';
					e.preventDefault();
				}

				function stopResize() {
					document.documentElement.removeEventListener( 'mousemove', doResize, false );
					document.documentElement.removeEventListener( 'mouseup', stopResize, false );
				}
			};
			resizeObject.init();
		};

		var HTMLAttributes = function() {
			var input = $( this ),
				options = {},
				resize = ( input.attr( 'data-resize' ) === 'true' || input.attr( 'data-resize' ) === 'True' );
			if ( resize ) {
				return input.data( 'wf.resizable', new Resizable( this, options ) );
			}
		};

		var globalsResize = {
			resizeElements: 'div',
			dataResizeAttr: '*[data-resize]'
		};

		var applyDataResize = function( selector ) {
			selector = selector || globalsResize.resizeElements;
			var $selector = ( selector instanceof $ ) ? selector : $( selector );
			$selector.filter( globalsResize.dataResizeAttr ).each( HTMLAttributes );
		};

		var old = $.fn.resizeable;

		$.fn.resizeable = function() {
			var resizeFunction = function() {
				return $( this ).data( 'wf.resizable', new Resizable( this ) );

			};
			$( this ).each( resizeFunction );
			return this;
		};

		$.fn.resizeable.noConflict = function() {
			$.fn.resizeable = old;
			return this;
		};

		$( document ).ready( function() {
			applyDataResize( 'div' );
		} );


	} )( $ );


	//search.js
	( function( $ ) {

		// SEARCH PUBLIC CLASS DEFINITION
		// ======================
		var Search = function( element, options ) {};

		if ( !$.fn.nInputField ) {
			throw new Error( 'Balloon requires WULF inputfield.js' );
		}

		Search.VERSION = '1.1.0';

		// NOTE: SEARCH EXTENDS inputfield.js
		// ================================
		Search.prototype = $.extend( {}, $.fn.nInputField.Constructor.prototype );
		Search.prototype.constructor = Search;

		// SEARCH INTERNAL METHODS
		// ========================

		// SEARCH PLUGIN DEFINITION
		// =========================
		function Plugin( option ) {
			return this.each( function() {
				var $this = $( this );
				var data = $this.data( 'wf.search' );
				var options = typeof option === 'object' && option;

				if ( !data && /destroy|hide/.test( option ) ) {
					return;
				}
				if ( !data ) {
					$this.data( 'wf.search', ( data = new Search( this, options ) ) );
				}
				if ( typeof option === 'string' ) {
					data[ option ]();
				}
			} );
		}

		var old = $.fn.nSearch;

		$.fn.nSearch = Plugin;
		$.fn.nSearch.Constructor = Search;

		// SEARCH NO CONFLICT
		// ===================
		$.fn.nSearch.noConflict = function() {
			$.fn.nSearch = old;
			return this;
		};

		$( document )
			.on( 'click.wf.forms', '.n-search-clearable .n-search-control-icon', Search.prototype.clearContent );

	} )( $ );


	//tab.js
	( function( $ ) {

		$( document ).ready( function() {
			$( ".nav.nav-tabs li:not('.disabled') .icon-close" ).click( function( e ) {
				e.stopPropagation();
				var $parent = $( this ).closest( "ul" );
				var $current = $( this ).closest( "li" );
				$current.remove();
				if ( $parent.find( "li.active" ).length === 0 ) {
					$parent.find( "li:nth-child(1):not('.disabled')" ).addClass( "active" ).parent()
						.next().children().removeClass( "active" );
					$( $parent.find( "li.active" ).children( 'a:nth-child(1)' ).attr( "href" ) ).addClass( "active" );
				}
				if ( $parent.children( "li:not('.disabled')" ).length === 0 ) {
					$parent.next().html( "" );
				}
				if ( $parent.find( "li.active" ).length !== 0 ) {
					$parent.find( "li.active a:nth-child(1)" ).focus();
				}
			} );
		} );

		$( document )
			.on( 'keydown.wf.common.keyboard', '.nav-tabs', $.wfKBCore.commonKeyboardHandler );

	} )( $ );


	//tabbable.js
	( function( $ ) {

		/**
		 * Focusses the next :focusable element. Elements with tabindex=-1 are focusable, but not tabable.
		 * Does not take into account that the taborder might be different as the :tabbable elements order
		 * (which happens when using tabindexes which are greater than 0).
		 */
		$.focusNext = function() {
			selectNextTabbableOrFocusable( ':focusable' );
		};

		/**
		 * Focusses the previous :focusable element. Elements with tabindex=-1 are focusable, but not tabable.
		 * Does not take into account that the taborder might be different as the :tabbable elements order
		 * (which happens when using tabindexes which are greater than 0).
		 */
		$.focusPrev = function() {
			selectPrevTabbableOrFocusable( ':focusable' );
		};

		/**
		 * Focusses the next :tabable element.
		 * Does not take into account that the taborder might be different as the :tabbable elements order
		 * (which happens when using tabindexes which are greater than 0).
		 */
		$.tabNext = function() {
			selectNextTabbableOrFocusable( ':tabbable' );
		};

		/**
		 * Focusses the previous :tabbable element
		 * Does not take into account that the taborder might be different as the :tabbable elements order
		 * (which happens when using tabindexes which are greater than 0).
		 */
		$.tabPrev = function() {
			selectPrevTabbableOrFocusable( ':tabbable' );
		};

		$.getNextTabbale = function() {
			var selectables = $( ':tabbable' );
			var current = $( ':focus' );
			var nextIndex = 0;
			if ( current.length === 1 ) {
				var currentIndex = selectables.index( current );
				if ( currentIndex + 1 < selectables.length ) {
					nextIndex = currentIndex + 1;
				}
			}

			return selectables.eq( nextIndex );
		};

		$.getPrevTabbale = function() {
			var selectables = $( ':tabbable' );
			var current = $( ':focus' );
			var prevIndex = selectables.length - 1;
			if ( current.length === 1 ) {
				var currentIndex = selectables.index( current );
				if ( currentIndex > 0 ) {
					prevIndex = currentIndex - 1;
				}
			}

			return selectables.eq( prevIndex );
		};

		function selectNextTabbableOrFocusable( selector ) {
			var selectables = $( selector );
			var current = $( ':focus' );
			var nextIndex = 0;
			if ( current.length === 1 ) {
				var currentIndex = selectables.index( current );
				if ( currentIndex + 1 < selectables.length ) {
					nextIndex = currentIndex + 1;
				}
			}

			selectables.eq( nextIndex ).focus();
		}

		function selectPrevTabbableOrFocusable( selector ) {
			var selectables = $( selector );
			var current = $( ':focus' );
			var prevIndex = selectables.length - 1;
			if ( current.length === 1 ) {
				var currentIndex = selectables.index( current );
				if ( currentIndex > 0 ) {
					prevIndex = currentIndex - 1;
				}
			}

			selectables.eq( prevIndex ).focus();
		}

		/**
		 * :focusable and :tabbable, both taken from jQuery UI Core
		 */
		$.extend( $.expr[ ':' ], {
			data: $.expr.createPseudo ?
				$.expr.createPseudo( function( dataName ) {
					return function( elem ) {
						return !!$.data( elem, dataName );
					};
				} ) :
				// support: jQuery <1.8
				function( elem, i, match ) {
					return !!$.data( elem, match[ 3 ] );
				},

			focusable: function( element ) {
				return focusable( element, !isNaN( $.attr( element, 'tabindex' ) ) );
			},

			tabbable: function( element ) {
				var tabIndex = $.attr( element, 'tabindex' ),
					isTabIndexNaN = isNaN( tabIndex );
				return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
			}
		} );

		/**
		 * focussable function, taken from jQuery UI Core
		 * @param element
		 * @returns {*}
		 */
		function focusable( element ) {
			var map, mapName, img,
				nodeName = element.nodeName.toLowerCase(),
				isTabIndexNotNaN = !isNaN( $.attr( element, 'tabindex' ) );
			if ( 'area' === nodeName ) {
				map = element.parentNode;
				mapName = map.name;
				if ( !element.href || !mapName || map.nodeName.toLowerCase() !== 'map' ) {
					return false;
				}
				img = $( 'img[usemap=#' + mapName + ']' )[ 0 ];
				return !!img && visible( img );
			}
			return ( /^(input|select|textarea|button|object)$/.test( nodeName ) ?
					!element.disabled :
					'a' === nodeName ?
					element.href || isTabIndexNotNaN :
					isTabIndexNotNaN ) &&
				// the element and all of its ancestors must be visible
				visible( element );

			function visible( element ) {
				return $.expr.filters.visible( element ) && !$( element ).parents().addBack().filter( function() {
					return $.css( this, 'visibility' ) === 'hidden';
				} ).length;
			}
		}

	} )( $ );


	//textarea.js
	( function( $ ) {

		$( document ).ready( function() {
			var textArea = $( ".content-scroll .n-textarea" );
			var $contentScroll = $( ".content-scroll" );
			var textAreaHeight = parseInt( $contentScroll.css( "height" ) ) - 17;
			textArea.css( "height", textAreaHeight );
			textArea.wrap( "<div class='textarea-wrapper' />" );

			var textAreaWrapper = textArea.parent( ".textarea-wrapper" );
			textAreaWrapper.css( "height", $contentScroll.css( "height" ) );
			textAreaWrapper.addClass( "textarea-wrapper-normal" );
			textAreaWrapper.mCustomScrollbar( {
				scrollInertia: 0,
				advanced: {
					autoScrollOnFocus: false
				}
			} );

			var hiddenDiv = $( document.createElement( "div" ) ),
				content = null;
			hiddenDiv.addClass( "textareaHiddenDiv" );
			hiddenDiv.css( "width", parseInt( textArea.css( "width" ) ) - 12 );
			hiddenDiv.css( "min-height", textAreaHeight );

			$( "body" ).prepend( hiddenDiv );

			$.fn.getCursorPosition = function() {
				var el = $( this ).get( 0 ),
					pos = 0;
				if ( "selectionStart" in el ) {
					pos = el.selectionStart;
				} else if ( "selection" in document ) {
					el.focus();
					var sel = document.selection.createRange(),
						selLength = document.selection.createRange().text.length;
					sel.moveStart( "character", -el.value.length );
					pos = sel.text.length - selLength;
				}
				return pos;
			};

			function updateScrollbar( localTextArea ) {
				var localContainer = localTextArea.parents( ".mCSB_container" );
				var localWrapper = localTextArea.parents( ".textarea-wrapper" );

				content = localTextArea.val();
				var cursorPosition = localTextArea.getCursorPosition();
				content = "<span>" + content.substr( 0, cursorPosition ) + "</span>" + content.substr( cursorPosition, content.length );
				content = content.replace( /\n/g, "<br />" );
				hiddenDiv.html( content + "<br />" );

				localTextArea.css( "height", hiddenDiv.height() );
				localWrapper.nScrollbar( "update" );

				var hiddenDivSpan = hiddenDiv.children( "span" ),
					hiddenDivSpanOffset = 0,
					viewLimitBottom = ( parseInt( hiddenDiv.css( "min-height" ) ) ) - hiddenDivSpanOffset,
					viewRatio = Math.round( hiddenDivSpan.height() + localContainer.position().top ),
					textareaLineHeight = parseInt( localTextArea.css( "line-height" ) );
				if ( viewRatio > viewLimitBottom || viewRatio < hiddenDivSpanOffset ) {
					var scrollLocation = parseInt( ( hiddenDivSpan.height() - hiddenDivSpanOffset ) / textareaLineHeight ) * textareaLineHeight;
					localWrapper.mCustomScrollbar( "scrollTo", scrollLocation );
				}
			}

			if ( textArea.length > 0 ) {
				updateScrollbar( textArea );
				textArea.bind( "keyup keydown", function() {
					updateScrollbar( $( this ) );
				} );
				textArea.bind( "focus", function() {
					var localWrapper = $( this ).parents( ".textarea-wrapper" );
					localWrapper.removeClass( "textarea-wrapper-normal" );
					localWrapper.addClass( "textarea-wrapper-focus" );
				} );
				textArea.bind( "blur", function() {
					var localWrapper = $( this ).parents( ".textarea-wrapper" );
					localWrapper.removeClass( "textarea-wrapper-focus" );
					localWrapper.addClass( "textarea-wrapper-normal" );
				} );
			}
		} );

	} )( $ );


	//timezone.js
	( function( $ ) {

		// TIMEZONE CLASS DEFINITION
		// =========================

		var Timezone = function( element ) {
			var $timezone = $( element );

			// Add n-timezone class if not exist
			if ( !$timezone.hasClass( 'n-timezone' ) ) {
				$timezone.addClass( 'n-timezone' );
			}

			// get timezone by moment-timezone API
			var cities = getTimezones();

			// sort timezone
			sortTimezones( cities );

			// append timezone items to pulldown list
			var $dropDown = $timezone.find( 'ul' );
			$dropDown.append( buildDropdownMenuItems( cities, null ) );

			// generate the pulldown list by Fuelux API -- selectlist
			$timezone.selectlist();

			// add filter input field
			var filterHtml = '<div class="filter-input"><div class="n-inputfield-clearable n-inputfield-filter"><a class="n-inputfield-filter-icon"><span class="icon icon-filter"></span></a><input type="text" class="form-control n-inputfield n-inputfield-small" placeholder="Filter..."><a href="javascript:void(0)" class="n-inputfield-control-icon n-inputfield-control-icon-small" style="display: none;"><span role="button" aria-label="clear textfield content" class="icon icon-close"></span></a></div><div class="seperator"></div></div>';
			$dropDown.before( filterHtml );
			$timezone.find( ".filter-input" ).hide();

			// Set default timezone based on client's timezone
			setDefaultTimezone( $timezone );

			// generate scroll pulldown menu by mCustomerScroll API
			$dropDown.mCustomScrollbar( {
				keyboard: {
					enable: false
				}
			} );

			// Add events to timezone selectlist
			// =================================

			// Do filter when user type in
			$timezone.find( ".n-inputfield-clearable input" ).on( 'keyup', function( event ) {
				var inputValue = event.target.value;
				var controlIcon = $( event.target ).next( '.n-inputfield-control-icon' );
				if ( inputValue.length > 0 ) {
					controlIcon.show();
				} else {
					controlIcon.hide();
				}
				doFilter( inputValue, $( event.target ) );
			} );

			// Clear input field by cancel button
			$timezone.find( ".n-inputfield-control-icon" ).on( "click", function( event ) {
				event.stopPropagation();
				var prev = $( this ).prev();
				if ( prev.hasClass( 'n-inputfield' ) ) {
					prev.focus();
					var $combobox = $( this ).closest( '.n-timezone' );
					clearFilterInputField( $combobox );
					resetAllItems( $combobox );
				}
			} );

			// Clear up all filtered result once user selects.
			$timezone.on( 'changed.fu.selectlist', function() {
				resetAllItems( $( this ) );
				clearSelectedStrongItems( $( this ) );
				clearFilterInputField( $( this ) );
			} );

			// Show and focus in filter input field when dropdown expanded.
			$timezone.on( 'shown.bs.dropdown', function() {
				var $combobox = $( this );
				$combobox.find( '.filter-input' ).show();
				$combobox.find( '.filter-input input' ).focus();
				var selectedIndex = $combobox.find( 'ul' ).find( '[data-selected=true]' ).index();
				$combobox.find( 'ul' )
					.mCustomScrollbar( "scrollTo", $combobox.find( 'ul' ).find( 'li:eq(' + selectedIndex + ')' ), {
						scrollInertia: 0
					} );
			} );

			// Hide filter input field when dropdown unexpanded
			$timezone.on( 'hide.bs.dropdown', function() {
				$( this ).find( '.filter-input' ).hide();
			} );

			// Avoid closing the dropdown when click on scrollbar
			$timezone.on( "click", '.mCSB_dragger_bar', function( e ) {
				e.stopPropagation();
			} );

			// Keyboard support -- Move focus to first visible item
			$timezone.on( "keydown", '.filter-input', function( e ) {
				// If trigger Down Arrow key
				if ( e.keyCode === 40 ) {
					e.preventDefault();
					$( this ).next( 'ul' ).find( 'li' ).each( function() {
						if ( isInViewPort( $( this ) ) === true ) {
							$( this ).children( 'a' ).focus();
							return false;
						}
					} );
				}
				// If Esc key
				if ( e.keyCode === 27 ) {
					$( this ).prev( 'button' ).trigger( 'click' );
					$( this ).prev( 'button' ).trigger( 'focus' );
				}


				// Temporary solution for "shift+(".
				// Cannot find the root cause why focus will move to dropdown item when type in the character match the item's first character.
				if ( e.keyCode === 57 && e.shiftKey ) {
					e.preventDefault();
					$( this ).find( 'input' ).val( '(' );
				}
			} );

			// Keyboard support -- Move focus to filter input field
			$timezone.on( "keydown", '.dropdown-menu li', function( e ) {
				// If trigger Up Arrow key
				if ( e.keyCode === 38 ) {
					if ( $( this ).is( ':visible' ) && isFirstVisibleItem( $( this ) ) ) {
						e.stopPropagation();
						$( this ).closest( '.n-timezone' ).find( '.filter-input input' ).focus();
					}
				}
			} );
		};

		Timezone.VERSION = '1.1.0';

		// TIMEZONE INTERNAL METHODS DEFINITION
		// ====================================

		function doFilter( inputValue, input ) {
			var $dropDown = input.closest( '.n-timezone' ).find( 'ul' );
			$dropDown.find( 'li' ).each( function() {
				var timezoneString = $( this ).find( 'span' ).html();
				timezoneString = timezoneString.replace( '<strong>', '' ).replace( '</strong>', '' );
				if ( timezoneString.toUpperCase().indexOf( inputValue.toUpperCase() ) < 0 ) {
					$( this ).hide();
				} else {
					$( this ).show();
					var subIndex = timezoneString.toUpperCase().indexOf( inputValue.toUpperCase() );
					var subString = timezoneString.substring( subIndex, subIndex + inputValue.length );
					timezoneString = timezoneString.replace( subString, '<strong>' + subString + '</strong>' );
				}
				$( this ).find( 'span' ).html( timezoneString );
			} );
		}

		function resetAllItems( $combobox ) {
			$combobox.find( 'li' ).each( function() {
				var timezoneString = $( this ).find( 'span' ).html();
				timezoneString = timezoneString.replace( '<strong>', '' ).replace( '</strong>', '' );
				$( this ).find( 'span' ).html( timezoneString );
				$( this ).show();
			} );
		}

		function clearSelectedStrongItems( $combobox ) {
			var selectedString = $combobox.find( '.selected-label > span' ).html();
			selectedString = selectedString.replace( '<strong>', '' ).replace( '</strong>', '' );
			$combobox.find( '.selected-label > span' ).html( selectedString );
		}

		function clearFilterInputField( $combobox ) {
			var input = $combobox.find( '.filter-input input' );
			input.val( '' );
			input.next( '.n-inputfield-control-icon' ).hide();
		}

		function sortTimezones( zones ) {
			zones.sort( function( a, b ) {
				var offsetA = parseInt( a.offset.replace( ":", "" ), 10 );
				var offsetB = parseInt( b.offset.replace( ":", "" ), 10 );
				if ( offsetA - offsetB !== 0 ) {
					return offsetA - offsetB;
				} else {
					if ( a.name > b.name ) {
						return 1;
					}
					if ( a.name < b.name ) {
						return -1;
					}
					return 0;
				}
			} );
		}

		function getTimezones() {
			var cities = [];
			var zones = moment.tz.names();
			for ( var key in zones ) {
				if ( zones.hasOwnProperty( key ) && zones[ key ] !== undefined ) {
					cities.push( {
						name: zones[ key ],
						offset: moment.tz( zones[ key ] ).format( 'Z' )
					} );
				}
			}
			return cities;
		}

		function setDefaultTimezone( $timezone ) {
			var currentOffset = 'Etc/GMT' + ( new Date().getTimezoneOffset() / 60 );
			$timezone.find( 'li' ).each( function() {
				if ( $( this ).data( 'value' ) === currentOffset ) {
					$timezone.selectlist( 'selectByValue', currentOffset );
				}
			} );
		}

		function buildDropdownMenuItems( zones, selectedValue ) {
			var html = '';
			for ( var i = 0; i < zones.length; i++ ) {
				var zone = zones[ i ];
				if ( selectedValue === zone.name ) {
					html += '<li data-value="' + zone.name + '" data-offset="' + zone.offset + '" data-selected="true"><a href="#"><span>(GMT ' + zone.offset + ') ' + zone.name + '</span></a></li>';
				} else {
					html += '<li data-value="' + zone.name + '" data-offset="' + zone.offset + '"><a href="#"><span>(GMT ' + zone.offset + ') ' + zone.name + '</span></a></li>';
				}
			}
			return html;
		}

		function isFirstVisibleItem( $item ) {
			var isFirstVisible = true;
			$item.prevAll( 'li' ).each( function() {
				if ( $( this ).is( ':visible' ) ) {
					isFirstVisible = false;
					return false;
				}
			} );
			return isFirstVisible;
		}

		function validTimezone( timezone ) {
			var isValid = false;
			var temp = timezone.split( '|' );
			if ( temp.length === 2 ) {
				var name = temp[ 0 ];
				var offset = temp[ 1 ];
				var nameReg = new RegExp( '\\S*\\/\\S*' );
				var offsetReg = new RegExp( '^(?:Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])$' );
				if ( offset.match( offsetReg ) !== null && name.match( nameReg ) !== null ) {
					isValid = true;
				}
			}
			return isValid;
		}

		function getSelectedValue( $combobox ) {
			var selectedValue = '';
			$combobox.find( 'li' ).each( function() {
				if ( $( this ).data( 'selected' ) === true ) {
					selectedValue = $( this ).data( 'value' );
					return false;
				}
			} );
			return selectedValue;
		}

		function isInViewPort( $el ) {
			var content = $el.parents( ".mCSB_container" ),
				wrapper, cPos;
			if ( !content.length ) {
				return;
			}
			wrapper = content.parent();
			cPos = [ content[ 0 ].offsetTop, content[ 0 ].offsetLeft ];
			return cPos[ 0 ] + _childPos( $el )[ 0 ] >= 0 && cPos[ 0 ] + _childPos( $el )[ 0 ] <= wrapper.height() - $el.outerHeight( false ) &&
				cPos[ 1 ] + _childPos( $el )[ 1 ] >= 0 && cPos[ 1 ] + _childPos( $el )[ 1 ] <= wrapper.width() - $el.outerWidth( false );
		}

		function _childPos( el ) {
			var p = el.parents( ".mCSB_container" );
			return [ el.offset().top - p.offset().top, el.offset().left - p.offset().left ];
		}

		// TIMEZONE PLUGIN DEFINITION
		// ==========================

		function Plugin( option ) {
			return this.each( function() {
				var $this = $( this );
				var data = $this.data( 'wf.timezone' );

				if ( !data ) {
					$this.data( 'wf.timezone', ( data = new Timezone( this ) ) );
				}
				if ( typeof option === 'string' ) {
					data[ option ].call( $this );
				}
			} );
		}

		var old = $.fn.nTimezone;

		$.fn.nTimezone = Plugin;
		$.fn.nTimezone.Constructor = Timezone;


		// TIMEZONE NO CONFLICT
		// ====================

		$.fn.nTimezone.noConflict = function() {
			$.fn.nTimezone = old;
			return this;
		};

		// TIMEZONE DATA-API MARKUP
		// ========================

		$( function() {
			$( '[data-markup^="timezone"]' ).each( function() {
				$( this ).nTimezone();
			} );
		} );

		// TIMEZONE EXTENDED METHODS
		// =========================

		$.fn.extend( {
			setDefaultZone: function( value ) {
				var $combobox = $( this );
				$combobox.find( 'li' ).each( function() {
					if ( $( this ).data( 'value' ) === value ) {
						$combobox.selectlist( 'selectByValue', value );
					}
				} );
			},

			addZone: function( value ) {
				var zones = [];
				$( this ).find( 'li' ).each( function() {
					zones.push( {
						name: $( this ).data( 'value' ),
						offset: $( this ).data( 'offset' )
					} );
				} );

				var values = [];
				if ( $.isArray( value ) ) {
					for ( var key in value ) {
						if ( value.hasOwnProperty( key ) && value[ key ] !== undefined ) {
							if ( validTimezone( value[ key ] ) ) {
								values = value[ key ].split( '|' );
								zones.push( {
									name: values[ 0 ],
									offset: values[ 1 ]
								} );
							}
						}
					}
				} else {
					if ( validTimezone( value ) ) {
						values = value.split( '|' );
						zones.push( {
							name: values[ 0 ],
							offset: values[ 1 ]
						} );
					}
				}

				sortTimezones( zones );
				$( this ).find( '.mCSB_container' ).html( buildDropdownMenuItems( zones, getSelectedValue( $( this ) ) ) );
			},

			removeZone: function( value ) {
				var zones = [];
				$( this ).find( 'li' ).each( function() {
					var name = $( this ).data( 'value' );
					var offset = $( this ).data( 'offset' );
					if ( $.isArray( value ) ) {
						if ( value.indexOf( name ) < 0 ) {
							zones.push( {
								name: name,
								offset: offset
							} );
						}
					} else {
						if ( value !== name ) {
							zones.push( {
								name: name,
								offset: offset
							} );
						}
					}
				} );

				sortTimezones( zones );
				$( this ).find( '.mCSB_container' ).html( buildDropdownMenuItems( zones, getSelectedValue( $( this ) ) ) );
			}
		} );

	} )( $ );


	//tree-table.js
	( function( $ ) {

		if ( $.jqx !== undefined ) {
			if ( $.jqx._jqxTreeGrid !== undefined ) {
				$.extend( $.jqx._jqxTreeGrid.prototype, {
					expandRow: function( h, j ) {
						// Original code -- Get from jqxtreegrid.js
						var d = this.base;
						if ( d._loading ) {
							return;
						}
						var e = d._names();
						var f = this;
						var b = d.rowinfo[ h ];
						if ( !b ) {
							var k = this.getRow( h );
							if ( k ) {
								d.rowinfo[ h ] = {
									row: k
								};
								if ( k.originalRecord ) {
									d.rowinfo[ h ].originalRecord = k.originalRecord;
								}
								b = d.rowinfo[ h ];
							}
						}
						if ( b ) {
							if ( b.expanded ) {
								b.row[ e.expanded ] = true;
								return;
							}
							b.expanded = true;
							b.row[ e.expanded ] = true;
							if ( b.originalRecord ) {
								b.originalRecord[ e.expanded ] = true;
							}
							if ( this.virtualModeCreateRecords && !b.row._loadedOnDemand ) {
								var c = function( m ) {
									b.row._loadedOnDemand = true;
									if ( m === false ) {
										d._loading = false;
										f._hideLoadElement();
										b.leaf = true;
										b.row[ e.leaf ] = true;
										d._renderrows();
										if ( j ) {
											j();
										}
										return;
									}
									for ( var n = 0; n < m.length; n++ ) {
										m[ n ][ e.level ] = b.row[ e.level ] + 1;
										m[ n ][ e.parent ] = b.row;
										if ( d.rowsByKey[ m[ n ].uid ] ) {
											d._loading = false;
											f._hideLoadElement();
											b.leaf = true;
											b.row[ e.leaf ] = true;
											d._renderrows();
											if ( j ) {
												j();
											}
											throw new Error( "Please, check whether you Add Records with unique ID/Key. " );
										}
										d.rowsByKey[ m[ n ].uid ] = m[ n ];
										f.virtualModeRecordCreating( m[ n ] );
									}
									if ( !b.row.records ) {
										b.row.records = m;
									} else {
										b.row.records = b.row.records.concat( m );
									}
									if ( ( !m ) || ( m && m.length === 0 ) ) {
										b.leaf = true;
										b.row[ e.leaf ] = true;
									}
									if ( b.originalRecord ) {
										b.originalRecord.records = m;
										b.originalRecord[ e.expanded ] = true;

										if ( m.length === 0 ) {
											b.originalRecord[ e.leaf ] = true;
										}
									}
									d._loading = false;
									f._hideLoadElement();
									var l = d.vScrollBar.css( "visibility" );
									d._renderrows();
									d._updateScrollbars();
									var o = l !== d.vScrollBar.css( "visibility" );
									if ( d.height === "auto" || d.height === null || d.autoheight || o ) {
										d._arrange();
									}
									d._renderhorizontalscroll();
									if ( j ) {
										j();
									}
								};
								if ( !b.row[ e.leaf ] ) {
									d._loading = true;
									this._showLoadElement();
									this.virtualModeCreateRecords( b.row, c );
									return;
								}
							}
							if ( !d.updating() ) {
								var g = d.vScrollBar.css( "visibility" );
								d._renderrows();
								d._updateScrollbars();
								var i = g !== d.vScrollBar.css( "visibility" );
								if ( d.height === "auto" || d.height === null || d.autoheight || i ) {
									d._arrange();
								}
								d._renderhorizontalscroll();
								d._raiseEvent( "rowExpand", {
									row: b.row,
									key: h
								} );
							}
						}

						// Extended code -- trigger scroll bar to right position
						var hostHeight = d.host.height();
						var tableHeight = d.table.height();
						var currentRow = this.getRow( h );
						var rows = d.getRows();
						var count = 0;
						while ( currentRow.parent !== null ) {
							count = count + getItemsBeforeInTable( currentRow, rows );
							currentRow = this.getRow( currentRow.parent );
						}
						var height = d.columnsHeight * count;
						var max = d.vScrollBar.jqxScrollBar( "max" );
						if ( tableHeight > hostHeight ) {
							if ( height > max ) {
								height = max;
							}
							d.vScrollBar.jqxScrollBar( "setPosition", height );
						}
					}
				} );
			}
		}

		/**
		 * Return the visible row count before the current row
		 *
		 * @param currentRow
		 * @param rows
		 * @returns {number}
		 */
		function getItemsBeforeInTable( currentRow, rows ) {
			var count = 0;
			for ( var i = 0; i < rows.length; i++ ) {
				if ( rows[ i ].uid === currentRow.uid ) {
					break;
				}
				if ( rows[ i ].parent === currentRow.parent ) {
					count++;
				}
			}
			return count;
		}

	} )( $ );


	//tree.js
	( function( $ ) {

		$( document ).ready(
			function() {
				if ( $.fn.tree !== undefined ) {
					$.fn.tree.Constructor.prototype.disable = function() {
						var self = this;
						self.$element.addClass( 'disabled-tree' );
						self.$element.find( 'a' ).each( function() {
							$( this ).removeAttr( "href" );
							$( this ).attr( 'disabled', 'disabled' );
						} );
						self.$element.find( 'input' ).attr( 'disabled', 'disabled' );
						self.$element.off( 'click.fu.tree', '.tree-branch-name' );

						// Disable scroll bar if exists
						if ( self.$element.find( ".mCSB_scrollTools" ).length > 0 ) {
							self.$element.mCustomScrollbar( 'destroy' );
							self.$element.mCustomScrollbar( {
								advanced: {
									autoExpandHorizontalScroll: true
								},
								alwaysShowScrollbar: 2,
								theme: 'disabled',
								mouseWheel: {
									enable: false,
									axis: 'x'
								}

							} );
							self.$element.mCustomScrollbar( "disable" );
						}
					};

					$.fn.tree.Constructor.prototype.enableScrollbar = function( width, height ) {
						var self = this;
						self.$element.nScrollbar();
						self.$element.css( 'width', width + 'px' );
						self.$element.css( 'height', height + 'px' );
					};

					$.fn.tree.Constructor.prototype.populate = function( $el ) {
						var self = this;
						var $parent = ( $el.hasClass( 'tree' ) ) ? $el : $el.parent();
						var loader = $parent.find( '.tree-loader:eq(0)' );
						var treeData = $parent.data();

						loader.removeClass( 'hide hidden' ); // hide is deprecated
						this.options.dataSource( treeData ? treeData : {}, function( items ) {
							loader.addClass( 'hidden' );
							$.each( items.data, function( index, value ) {
								var $entity;

								if ( value.type === 'folder' ) {
									$entity = self.$element.find( '[data-template=treebranch]:eq(0)' ).clone().removeClass( 'hide hidden' ).removeData( 'template' ); // hide is deprecated
									$entity.data( value );
									$entity.find( '.tree-branch-name > .tree-label' ).html( value.text || value.name );
								} else if ( value.type === 'item' ) {
									$entity = self.$element.find( '[data-template=treeitem]:eq(0)' ).clone().removeClass( 'hide hidden' ).removeData( 'template' ); // hide is deprecated
									$entity.find( '.tree-item-name > .tree-label' ).html( value.text || value.name );
									$entity.data( value );
								}

								// Added support for description and icon
								if ( value.desc ) {
									$entity.find( '.tree-label' ).append( "<span class='tree-description'> &ndash; " + value.desc + "</span>" );
								}
								if ( value.icon ) {
									$entity.find( '.tree-label' ).append( "<span class='icon " + value.icon + "'></span>" );
								}

								// add attributes to tree-branch or tree-item

								var attr = value.attr || value.dataAttributes || [];
								$.each( attr, function( key, value ) {
									switch ( key ) {
										case 'cssClass':
										case 'class':
										case 'className':
											$entity.addClass( value );
											break;

											// allow custom icons
										case 'data-icon':
											$entity.find( '.icon-item' ).removeClass().addClass( 'icon-item ' + value );
											$entity.attr( key, value );
											break;

											// ARIA support
										case 'id':
											$entity.attr( key, value );
											$entity.attr( 'aria-labelledby', value + '-label' );
											$entity.find( '.tree-branch-name > .tree-label' ).attr( 'id', value + '-label' );
											break;

											// style, data-*
										default:
											$entity.attr( key, value );
											break;
									}
								} );

								// add child nodes
								if ( $el.hasClass( 'tree-branch-header' ) ) {
									$parent.find( '.tree-branch-children:eq(0)' ).append( $entity );
								} else {
									$el.append( $entity );
								}
							} );
							// return newly populated folder
							self.$element.trigger( 'loaded.fu.tree', $parent );
						} );
					};
				}
				// function of tree of checkbox
				function clickTree( ev ) {
					updateLinkInTree( ev.currentTarget );
				}

				function updateLinkInTree( e ) {
					var allBranchMenu = $( e ).find( ".tree-branch" );
					for ( var j = 0; j < allBranchMenu.length; j++ ) {
						var branch = allBranchMenu[ j ];
						if ( $( branch ).attr( "src" ) !== "" ) {
							var header = $( branch ).children( ".tree-branch-header" );
							var a = $( header ).children( ".tree-branch-name" );
							$( a ).attr( "href", $( branch ).attr( "src" ) );
						}
					}

					var allItemMenu = $( e ).find( ".tree-item" );
					for ( var k = 0; k < allItemMenu.length; k++ ) {
						var item = allItemMenu[ k ];
						if ( $( item ).attr( "src" ) !== "" ) {
							var b = $( item ).children( ".tree-item-name" );
							$( b ).attr( "href", $( item ).attr( "src" ) );
						}
					}
				}

				function trigerTreeItem( ev ) {
					if ( ev.which !== 32 && ev.which !== 1 ) {
						return;
					}
					ev.preventDefault();
					ev.stopPropagation();
					/*jshint validthis:true */
					var currentStatus = $( this ).find( "input" ).prop( "checked" );
					var targetStatus = !currentStatus;
					/*jshint validthis:true */
					$( this ).find( "input" ).prop( "checked", targetStatus );
					updateTree();
				}

				function trigerTreeFolder( ev ) {
					if ( ev.which !== 32 && ev.which !== 1 ) {
						return;
					}
					ev.preventDefault();
					ev.stopPropagation();
					/*jshint validthis:true */
					var currentStatus = $( this ).find( "input" ).prop( "checked" );
					var targetStatus = !currentStatus;
					$( this ).find( "input" ).prop( {
						checked: targetStatus,
						indeterminate: false
					} );
					var arrChk = $( this ).closest( ".tree-branch" ).find( "input" );
					arrChk.each( function() {
						$( this ).prop( {
							checked: targetStatus,
							indeterminate: false
						} );
					} );
					updateTree();
				}

				function scrollTree( e ) {
					var currentTarget = e.currentTarget;
					var parentNode = $( currentTarget ).parent();
					if ( $( parentNode ).hasClass( 'tree-branch-name' ) || $( parentNode ).hasClass( 'tree-branch-header' ) ) {
						var closetLiNode = parentNode.closest( 'li' );
						if ( !$( closetLiNode ).hasClass( 'tree-open' ) ) {
							var rootNode = parentNode.closest( 'ul.tree' );
							var treeClientHeight = rootNode.get( 0 ).clientHeight;
							var childNodesNum = closetLiNode.find( 'ul li' ).size();
							var lineHeight = $( parentNode ).get( 0 ).offsetHeight;
							var currentOffsetHeight = $( currentTarget ).offset().top - rootNode.offset().top;
							var initScroll = ( childNodesNum === 0 && currentOffsetHeight > treeClientHeight * 3 / 4 );
							if ( ( treeClientHeight < ( currentOffsetHeight + ( childNodesNum + 1 ) * lineHeight ) ) || initScroll ) {
								rootNode.mCustomScrollbar( 'scrollTo', currentTarget, {
									scrollInertia: 0
								} );
							}
						}
					}
				}

				function updateTree() {
					$( ".tree-branch-name > .checkbox > input[name='folder']" ).each( function() {
						var statuses = [];
						$( this ).closest( ".tree-branch" ).find( "input[name='file']" ).each(
							function() {
								statuses.push( $( this ).prop( "checked" ) );
							}
						);
						if ( statuses.length !== 0 ) {
							var allfileschecked = statuses.reduce( function( a, b ) {
								return a && b;
							} );
							var partfilechecked = statuses.reduce( function( a, b ) {
								return a || b;
							} );
							$( this ).prop( "checked", allfileschecked );
							if ( allfileschecked ) {
								$( this ).prop( {
									checked: true,
									indeterminate: false
								} );
							} else if ( partfilechecked ) {
								$( this ).prop( {
									checked: false,
									indeterminate: true
								} );
							} else {
								$( this ).prop( {
									checked: false,
									indeterminate: false
								} );
							}
						}
					} );
				}
				// change the href of every item and branch
				setTimeout( function() {
					var trees = $( '.tree' );
					for ( var i = 0; i < trees.length; i++ ) {
						updateLinkInTree( trees[ i ] );
						$( trees[ i ] ).on( "click", clickTree );
					}
				}, 500 );
				/** For tree with checkbox */
				// process the leaf check box click events
				// when click the select item then expand the tree item 's children with scrool
				$( document )
					.on( "keydown", ".tree-has-checkbox li.tree-item .checkbox[name='file']", trigerTreeItem )
					.on( "click", ".tree-has-checkbox li.tree-item .checkbox[name='file']", trigerTreeItem )
					.on( "keydown", ".tree-has-checkbox li.tree-branch .checkbox[name='folder']", trigerTreeFolder )
					.on( "click", ".tree-has-checkbox li.tree-branch .checkbox[name='folder']", trigerTreeFolder )
					.on( 'click.fu.tree', '.tree .icon-caret', function( e ) {
						scrollTree( e );
					} )
					.on( 'click.fu.tree', '.tree .tree-label', function( e ) {
						scrollTree( e );
					} );
			} );

		// TREE KEYBOARD ACCESSIBILITY METHODS DEFINITION
		// ==============================================
		$( document ).on( 'keydown.wf.tree.keyboard', '.tree', $.wfKBTree.treeKeyboardHandler );

	} )( $ );

	/* jshint ignore:end */
} ) );
