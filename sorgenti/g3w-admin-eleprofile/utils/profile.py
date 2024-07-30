# coding=utf-8
""""
    Profile utils function for creat e profile object, used qprof api.
.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the Mozilla Public License 2.0.

"""

__author__ = 'lorenzetti@gis3w.it'
__date__ = '2020-07-15'
__copyright__ = 'Copyright 2015 - 2020, Gis3w'


from eleprofile.vendor.qprof.gis_utils.profile import interpolate_z
import math


def topoline_from_dem(resampled_trace2d, bOnTheFlyProjection, project_crs, dem, dem_params, delta_dem):
    """ Inherit fron qprof homonimous function
    """

    if bOnTheFlyProjection and dem.crs() != project_crs:
        trace2d_in_dem_crs = resampled_trace2d.crs_project(project_crs, dem.crs())
    else:
        trace2d_in_dem_crs = resampled_trace2d

    ln3dtProfile = []
    delta = 0
    for trace_pt2d_dem_crs, trace_pt2d_project_crs in zip(trace2d_in_dem_crs.pts, resampled_trace2d.pts):
        fInterpolatedZVal = interpolate_z(dem, dem_params, trace_pt2d_dem_crs)

        ln3dtProfile.append(
            (
                trace_pt2d_project_crs.x,
                trace_pt2d_project_crs.y,
                fInterpolatedZVal if not math.isnan(fInterpolatedZVal) else 0,
                delta
            )
        )
        delta += delta_dem

    return ln3dtProfile