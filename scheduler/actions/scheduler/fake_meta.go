/*
 * Copyright (c) 2018. Abstrium SAS <team (at) pydio.com>
 * This file is part of Pydio Cells.
 *
 * Pydio Cells is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio Cells is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio Cells.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

package scheduler

import (
	"context"

	"github.com/micro/go-micro/client"

	"github.com/pydio/cells/common"
	"github.com/pydio/cells/common/log"
	"github.com/pydio/cells/common/proto/idm"
	"github.com/pydio/cells/common/proto/jobs"
	"github.com/pydio/cells/common/registry"
	service "github.com/pydio/cells/common/service/proto"
	"github.com/pydio/cells/scheduler/actions"
)

var (
	fakePutMeta = "actions.fake.put.meta"
)

type FakePutMeta struct {
	uuid, jsonValue, namespace, nodeUuid string
	policies                             []*service.ResourcePolicy
}

// GetName returns this action unique identifier
func (f *FakePutMeta) GetName() string {
	return fakePutMeta
}

// Implement ControllableAction
func (f *FakePutMeta) CanPause() bool {
	return false
}

// Implement ControllableAction
func (f *FakePutMeta) CanStop() bool {
	return false
}

// ProvidesProgress mocks ProgressProviderAction interface method
func (f *FakePutMeta) ProvidesProgress() bool {
	return true
}

// Init passes parameters to the action
//TODO PARSE MAP uuid etc... of meta
func (f *FakePutMeta) Init(job *jobs.Job, cl client.Client, action *jobs.Action) error {
	//f.prefix = "user-"
	//f.number = 200
	//if prefix, ok := action.Parameters["prefix"]; ok {
	//	f.prefix = prefix
	//}
	//if strNumber, ok := action.Parameters["ticker"]; ok {
	//	if number, err := strconv.ParseInt(strNumber, 10, 64); err == nil {
	//		f.number = number
	//	}
	//}
	return nil
}

// Run the actual action code
func (f *FakePutMeta) Run(ctx context.Context, channels *actions.RunnableChannels, input jobs.ActionMessage) (jobs.ActionMessage, error) {
	log.TasksLogger(ctx).Info("Starting FakePutMeta")

	outputMessage := input
	outputMessage.AppendOutput(&jobs.ActionOutput{StringBody: "FakePutMeta 360 flip"})

	namespaceClient := idm.NewUserMetaServiceClient(registry.GetClient(common.SERVICE_USER_META))
	builder := service.NewResourcePoliciesBuilder()

	//biduleClient := idm.NewWorkspaceServiceClient()

	//Using usermata-tags atm as it is created by default
	for _, u := range input.Nodes {
		_, e := namespaceClient.UpdateUserMeta(ctx, &idm.UpdateUserMetaRequest{
			Operation: idm.UpdateUserMetaRequest_PUT,
			MetaDatas: []*idm.UserMeta{{
				Uuid:      u.Uuid,
				Namespace: "usermeta-tags",
				Policies:  builder.Reset().WithProfileRead(common.PYDIO_PROFILE_STANDARD).WithProfileWrite(common.PYDIO_PROFILE_STANDARD).Policies(),
				JsonValue: "alpha,beta,omega,zeta",
			},
			},
		})
		if e != nil {
			log.TasksLogger(ctx).Error("could not put usermeta nolie")
		}
	}

	return outputMessage, nil
}
