/**
 * Created by walter on 15/07/16.
 */

_.extend(g3wadmin.widget, {

    _revoketerminateItemParams: [
        'url',
        'task-id',
        'modal-title'
    ],

    _clearDBByTaskIdParams: [
        'url',
        'task-id',
        'modal-title'
    ],

    _clearDBParams: [
        'url',
        'modal-title'
    ],

    _taskInfoParams: [
        'url'
    ],

    revokeTerminateTask: function($item){
        try {
            // search into $item attrs
            var params = ga.utils.getDataAttrs($item, this._revoketerminateItemParams);
            if (_.isUndefined(params['url'] && _.isUndefined(params['task-id']))) {
                throw new Error('Attribute data-url and/or data-task-id not defined');
            }

            // check for pre-delete-message
            var preMessage = $item.parent().find('.pre-revoke-terminate-message').html();

            // open modal to confirm delete
            var modal = ga.ui.buildDefaultModal({
                modalTitle: 'Revoke/Terminate task',
                modalBody: 'Are you sure to revoke/terminate this task?' + preMessage ,
                closeButtonText: 'No'
            });

            //call ajax delete url
            var actionRevokeTerminate = function () {
                var data = {};
                ga.utils.addCsfrtokenData(data);
                $.ajax({
                    method: 'post',
                    url: params['url'],
                    data: data,
                    success: function (res) {
                        window.location.reload();
                    },
                    error: function (xhr, textStatus, errorMessage) {
                        ga.widget.showError(ga.utils.buildAjaxErrorMessage(xhr.status, errorMessage));
                    }


                });
            }
            modal.setConfirmButtonAction(actionRevokeTerminate);
            modal.show();

        } catch (e) {
            this.showError(e.message);
        }
    },

    /**
     * Check on continuos task info status
     */
    taskInfo: function($item){
        if ($item.length == 0) return;
        try {
            // data into $item attrs
            var params = ga.utils.getDataAttrs($item, this._taskInfoParams);
            if (_.isUndefined(params['url'])) {
                throw new Error('Attribute data-url not defined');
            }

            var $pb = $item.find('.progress-bar');

            //call ajax info url
            var taskinfo = function () {
                $.ajax({
                    method: 'get',
                    url: params['url'],
                    success: function (res) {
                        var current_progress = 0;
                        if (res['status'] == 'PENDING') {
                            current_progress = res['pending_percent'];
                            $pb.css("width", current_progress + "%")
                              .attr("aria-valuenow", current_progress)
                              .text(current_progress + "% Complete");
                        }

                        if (current_progress >= 100 || res['status'] == 'SUCCESS') {
                          clearInterval(interval);
                          $pb.css("width",  "100%")
                              .attr("aria-valuenow", '100')
                              .text("100% Complete");

                          //reload page after 1sec
                          setTimeout(function(){
                               window.location.reload(1);
                               }, 1000);
                        }
                    },
                    error: function (xhr, textStatus, errorMessage) {
                        ga.widget.showError(ga.utils.buildAjaxErrorMessage(xhr.status, errorMessage));
                    }


                });
            };

            var interval = setInterval(taskinfo, 1000)


        } catch (e) {
            this.showError(e.message);
        }
    },

    _handleClearResults: function(params, modal){

        return  function () {
                var data = {};
                ga.utils.addCsfrtokenData(data);
                $.ajax({
                    method: 'post',
                    url: params['url'],
                    data: data,
                    success: function (res) {
                        var pageAlert = ga.ui.buildPageAlert();
                        var $list = $('<ul></ul>')
                        _.each(res.deleted_rows, function(value, key){
                            $list.append($("<li></li>").html("<b>"+key+"</b>: "+value));
                        });
                        pageAlert.setBody($list);
                        pageAlert.show($('.box-upload'));
                        modal.hide();
                    },
                    error: function (xhr, textStatus, errorMessage) {
                        ga.widget.showError(ga.utils.buildAjaxErrorMessage(xhr.status, errorMessage));
                    }
                });
            }

        // msg for how many row deleted

    },

    clearDBByTaskId: function($item){
        try {
            // search into $item attrs
            var params = ga.utils.getDataAttrs($item, this._clearDBByTaskIdParams);
            if (_.isUndefined(params['url'] && _.isUndefined(params['task-id']))) {
                throw new Error('Attribute data-url and/or data-task-id not defined');
            }

            // check for pre-delete-message
            var preMessage = $item.parent().find('.pre-revoke-terminate-message').html();

            if (_.isUndefined(preMessage)){
                preMessage = '';
            }


            // open modal to confirm delete
            var modal = ga.ui.buildDefaultModal({
                modalTitle: 'Clear DB by Task Id',
                modalBody: 'Are you sure to clear DB?' + preMessage ,
                closeButtonText: 'No'
            });

            //call ajax url
            var actionClear = ga.widget._handleClearResults(params, modal);
            modal.setConfirmButtonAction(actionClear);
            modal.show();

        } catch (e) {
            this.showError(e.message);
        }
    },

    clearDB: function($item){
        try {
            // search into $item attrs
            var params = ga.utils.getDataAttrs($item, this._clearDBParams);
            if (_.isUndefined(params['url'])) {
                throw new Error('Attribute data-url is not defined');
            }


            // open modal to confirm delete
            var modal = ga.ui.buildDefaultModal({
                modalTitle: 'Clear DB for cadastre data',
                modalBody: 'Are you sure to clear DB for cadastre data?',
                closeButtonText: 'No'
            });

            var actionClear = ga.widget._handleClearResults(params, modal);
            modal.setConfirmButtonAction(actionClear);
            modal.show();

        } catch (e) {
            this.showError(e.message);
        }
    }
});

_.extend(g3wadmin.ui, {

    initRevokeTerminateTaskWidget: function() {
        $(document).on('click', '[data-widget-type="revokeTerminateTask"]', function(e){
            ga.widget.revokeTerminateTask($(this));
        });
    },

    initClearDBByTaskIdWidget: function() {
        $(document).on('click', '[data-widget-type="clearDBByTaskId"]', function(e){
            ga.widget.clearDBByTaskId($(this));
        });
    },

    initClearDBWidget: function() {
        $(document).on('click', '[data-widget-type="clearDB"]', function(e){
            ga.widget.clearDB($(this));
        });
    },

    initTaskInfoWidget: function() {
        ga.widget.taskInfo($('[data-widget-type="taskInfo"]'));
    },
});


